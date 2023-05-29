import httpServer from '../server';
import supertest from 'supertest';
import correct from './testTools/quizzes/correct.json';

import { WebSocket } from 'ws';
import { WEBSOCKET_BASE_URL } from './testTools/apiDef';
import { waitForSocketState } from './testTools/connect';

interface CreationResponse {
	gameId: string;
	hostId: string;
}

let request: supertest.SuperTest<supertest.Test>;

beforeAll(() => {
	request = supertest(httpServer);
});

afterAll((done) => {
	httpServer.close(done);
});

describe('Player Control', () => {
	// Set-Up
	let hostSocket: WebSocket;
	let playerSocket: WebSocket;
	let playerId: string;
	const player = {
		username: 'Jorge',
	};
	const answer = {
		userId: '',
		answer: 1,
	};
	let createRes: CreationResponse;
	let serverMessage: any;

	// Host and Game Set-Up
	test('Quiz Upload', async () => {
		await request
			.post('/games')
			.send(correct)
			.expect(201)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.gameId).toBeDefined();
				expect(data.body.hostId).toBeDefined();
				createRes = data.body;
			});
	});

	test('Host Connect', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', createRes.hostId);
		hostSocket = new WebSocket(url);
		await waitForSocketState(hostSocket, WebSocket.OPEN);
	});

	// Player Set-Up
	test('Player Join', async () => {
		await request
			.post(`/games/${createRes.gameId}/players`)
			.send(player)
			.expect(201)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.id).toBeDefined();
				playerId = data.body.id;
				answer.userId = playerId;
			});
	});

	test('Player Connect', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', playerId);
		playerSocket = new WebSocket(url);
		await waitForSocketState(playerSocket, WebSocket.OPEN);
		playerSocket.on('message', function message(raw) {
			serverMessage = JSON.parse(raw.toString());
		});
	});

	// Quiz Start
	test('Start Quiz', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/0/start`)
			.expect(200);

		// Check Websocket Message
		expect(serverMessage).toBeDefined();
		expect(serverMessage.type).toBeDefined();
		expect(serverMessage.type).toStrictEqual('startQuestion');
		expect(serverMessage.questionText).toBeDefined();
		expect(serverMessage.questionText).toStrictEqual('Are we human?');
		expect(serverMessage.answerTexts).toBeDefined();
		expect(serverMessage.answerTexts).toStrictEqual(
			correct.questions[0].answerTexts
		);
		expect(serverMessage.time).toBeDefined();
		expect(serverMessage.time).toStrictEqual(10000);
		expect(serverMessage.index).toBeDefined();
		expect(serverMessage.index).toStrictEqual(0);
		expect(serverMessage.username).toBeDefined();
		expect(serverMessage.username).toStrictEqual('Jorge');
		expect(serverMessage.score).toBeDefined();
		expect(serverMessage.score).toStrictEqual(0);
	});

	// Question Answering Tests
	test('Answer Question / Correct', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/0/answer`)
			.send(answer)
			.expect(200)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(true);
			});
	});

	test('End Question', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/0/end`)
			.expect(200);
		expect(serverMessage).toBeDefined();
		expect(serverMessage.type).toBeDefined();
		expect(serverMessage.type).toStrictEqual('endQuestion');
		expect(serverMessage.correctAnswers).toBeDefined();
		expect(serverMessage.correctAnswers).toStrictEqual([1]);
		expect(serverMessage.explanations).toBeDefined();
		// Strict Equal / TODO update test quiz
		expect(serverMessage.score).toBeDefined();
		// Strict Equal / TODO fix negative scores
		expect(serverMessage.scoreChange).toBeDefined();
		// Strict Equal / TODO fix negative scores
		expect(serverMessage.correct).toBeDefined();
		expect(serverMessage.correct).toStrictEqual(true);
		expect(serverMessage.responseTime).toBeDefined();
		expect(serverMessage.questionText).toBeDefined();
		expect(serverMessage.questionText).toStrictEqual('Are we human?');
		expect(serverMessage.answerTexts).toBeDefined();
		expect(serverMessage.answerTexts).toStrictEqual(
			correct.questions[0].answerTexts
		);
		expect(serverMessage.index).toBeDefined();
		expect(serverMessage.index).toStrictEqual(0);
		expect(serverMessage.username).toBeDefined();
		expect(serverMessage.username).toStrictEqual('Jorge');
		expect(serverMessage.yourAnswer).toBeDefined();
		expect(serverMessage.yourAnswer).toStrictEqual(1);

		// Leaderboard Field Validation
		expect(serverMessage.leaderboard).toBeDefined();
	});

	test('Start Second Question', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/1/start`)
			.expect(200);
	});

	test('Answer Question / Incorrect', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/1/answer`)
			.send(answer)
			.expect(200)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(true);
			});
	});

	test('End Second Question', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/1/end`)
			.expect(200);
	});

	// Close Game
	test('Close Player', async () => {
		playerSocket.close();
		await waitForSocketState(playerSocket, WebSocket.CLOSED);
	});

	test('Close Host', async () => {
		hostSocket.close();
		await waitForSocketState(hostSocket, WebSocket.CLOSED);
	});
});
