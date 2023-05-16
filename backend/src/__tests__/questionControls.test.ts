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

describe('Question Controls', () => {
	// Set-Up Tests
	let hostSocket: WebSocket;
	let createRes: CreationResponse;
	let serverMessage: JSON;
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

	// Host Connection
	test('Host Connect', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', createRes.hostId);
		hostSocket = new WebSocket(url);
		await waitForSocketState(hostSocket, WebSocket.OPEN);
	});

	// Control Tests
	test('Start Question Failure / Question Out of Quiz', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/2/start`)
			.expect(404)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(false);
			});
	});

	test('End Question Failure / Question Out of Quiz', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/2/end`)
			.expect(400)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(false);
				console.log(data.error);
				console.log(data.body.err);
			});
	});

	test('Start Quiz', async () => {
		hostSocket.on('message', function message(raw) {
			serverMessage = JSON.parse(raw.toString());
		});
		await request
			.post(`/games/${createRes.gameId}/questions/0/start`)
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
			.expect(200)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(true);
			});
	});

	test('Results', async () => {
		await request
			.get(`/games/${createRes.gameId}/results`)
			.expect(200)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(true);
			});
	});

	// Close Game
	test('Close Host', async () => {
		hostSocket.close();
		await waitForSocketState(hostSocket, WebSocket.CLOSED);
	});
});
