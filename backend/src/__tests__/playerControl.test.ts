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
	let serverMessage: JSON;

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
	});

	// Quiz Start
	test('Start Quiz', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/0/start`)
			.expect(200);
	});

	// Question Answering Tests
	test('Answer Question / Correct', async () => {
		playerSocket.on('message', function message(raw) {
			serverMessage = JSON.parse(raw.toString());
		});
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