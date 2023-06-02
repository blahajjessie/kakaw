import httpServer from '../server';
import supertest from 'supertest';
import correct from './testTools/quizzes/correct.json';

import { WebSocket } from 'ws';
import { WEBSOCKET_BASE_URL, CreationResponse } from './testTools/testDef';
import { waitForSocketState } from './testTools/connect';
import { validate } from './testTools/validateSocket';

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
	const player = {
		username: 'Jorge',
		id: '',
		token: '',
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
				expect(data.body.token).toBeDefined();
				createRes = data.body;
			});
	});

	test('Host Connect', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', createRes.hostId);
		url.searchParams.set('token', createRes.token);
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
				expect(data.body.token).toBeDefined();
				player.id = data.body.id;
				player.token = data.body.token;
				answer.userId = data.body.id;
			});
	});

	test('Player Connect', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', player.id);
		url.searchParams.set('token', player.token);
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
			.set({ authorization: 'Bearer ' + createRes.token })
			.expect(200);

		// Check Websocket Message
		validate(serverMessage);
		expect(serverMessage.type).toStrictEqual('startQuestion');
		expect(serverMessage.questionText).toStrictEqual('Are we human?');
		expect(serverMessage.answerTexts).toStrictEqual(
			correct.questions[0].answerTexts
		);
		expect(serverMessage.time).toStrictEqual(10000);
		expect(serverMessage.index).toStrictEqual(0);
		expect(serverMessage.username).toStrictEqual('Jorge');
		expect(serverMessage.score).toStrictEqual(0);
	});

	// Question Answering Tests
	test('Answer Question / Correct', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/0/answer`)
			.set({ authorization: 'Bearer ' + player.token })
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
			.set({ authorization: 'Bearer ' + createRes.token })
			.expect(200);

		// Check Websocket Message
		validate(serverMessage);
		expect(serverMessage.type).toStrictEqual('endQuestion');
		expect(serverMessage.correctAnswers).toStrictEqual([1]);
		// Strict Equal / TODO fix negative scores
		// Strict Equal / TODO fix negative scores
		expect(serverMessage.correct).toStrictEqual(true);
		expect(serverMessage.questionText).toStrictEqual('Are we human?');
		expect(serverMessage.answerTexts).toStrictEqual(
			correct.questions[0].answerTexts
		);
		expect(serverMessage.index).toStrictEqual(0);
		expect(serverMessage.username).toStrictEqual('Jorge');
		expect(serverMessage.yourAnswer).toStrictEqual(1);

		// Leaderboard Field Validation
		expect(serverMessage.leaderboard[0].name).toBeDefined();
		expect(serverMessage.leaderboard[0].score).toBeDefined();
		expect(serverMessage.leaderboard[0].correctAnswers).toBeDefined();
		expect(serverMessage.leaderboard[0].name).toStrictEqual('Jorge');
		// expect(serverMessage.leaderboard[0].score).toStrictEqual(4);
		expect(serverMessage.leaderboard[0].correctAnswers).toStrictEqual([0]);
	});

	test('Start Second Question', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/1/start`)
			.set({ authorization: 'Bearer ' + createRes.token })
			.expect(200);

		// Check Websocket Message
		validate(serverMessage);
		expect(serverMessage.questionText).toStrictEqual('Or are we dancer?');
		expect(serverMessage.index).toStrictEqual(1);
	});

	test('Answer Question / Incorrect', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/1/answer`)
			.set({ authorization: 'Bearer ' + player.token })
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
			.set({ authorization: 'Bearer ' + createRes.token })
			.expect(200);

		// Check Websocket Message
		validate(serverMessage);
		expect(serverMessage.correct).toStrictEqual(false);
		expect(serverMessage.scoreChange).toStrictEqual(0);
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
