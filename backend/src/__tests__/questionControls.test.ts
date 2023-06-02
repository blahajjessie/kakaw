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

describe('Question Controls', () => {
	// Set-Up Tests
	let hostSocket: WebSocket;
	let createRes: CreationResponse;
	let serverMessage: any;
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

	// Host Connection
	test('Host Connect', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', createRes.hostId);
		url.searchParams.set('token', createRes.token);
		hostSocket = new WebSocket(url);
		await waitForSocketState(hostSocket, WebSocket.OPEN);
		hostSocket.on('message', function message(raw) {
			serverMessage = JSON.parse(raw.toString());
		});
	});

	// Control Tests
	test('Start Question Failure / Question Out of Quiz', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/2/start`)
			.set({authorization: 'Bearer ' + createRes.token})
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
			.set({authorization: 'Bearer ' + createRes.token})
			.expect(400)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(false);
			});
	});

	test('Start Quiz', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/0/start`)
			.set({authorization: 'Bearer ' + createRes.token})
			.expect(200)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(true);
			});

		// Check Websocket Message
		validate(serverMessage);
	});

	test('End Question', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/0/end`)
			.set({authorization: 'Bearer ' + createRes.token})
			.expect(200)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(true);
			});

		// Check Websocket Message
		validate(serverMessage);
		expect(serverMessage.yourAnswer).toStrictEqual(-1);
	});

	test('Results', async () => {
		await request
			.get(`/games/${createRes.gameId}/results`)
			.set({authorization: 'Bearer ' + createRes.token})
			.expect(200)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.ok).toBeDefined();
				expect(data.body.ok).toBe(true);
			});

		// Check Websocket Message
		validate(serverMessage);
	});

	// Close Game
	test('Close Host', async () => {
		hostSocket.close();
		await waitForSocketState(hostSocket, WebSocket.CLOSED);
	});
});
