import httpServer from '../server';
import supertest from 'supertest';
import correct from './testTools/quizzes/correct.json';

import { WebSocket } from 'ws';
import { waitForSocketState } from './testTools/connect';
import { WEBSOCKET_BASE_URL, CreationResponse } from './testTools/testDef';

let request: supertest.SuperTest<supertest.Test>;

beforeAll(() => {
	request = supertest(httpServer);
});

afterAll((done) => {
	httpServer.close(done);
});

describe('WebSocket Connection Tests', () => {
	// Set Tests
	let hostSocket: WebSocket;
	let createRes: CreationResponse;
	test('Quiz Does Not Exist', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', '55555');
		url.searchParams.set('playerId', '55555');
		url.searchParams.set('token', '55555');
		const wrongSocket = new WebSocket(url);
		wrongSocket.on('error', (err) => {
			expect(err).toBeDefined();
		});
		await waitForSocketState(wrongSocket, WebSocket.CLOSED);
	});

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

	// Test Socket Destruction when trying to upgrade on the wrong path
	test('Wrong Path', async () => {
		const failSocket = new WebSocket(`ws://localhost:8080/con`);
		failSocket.on('error', (err) => {
			expect(err).toBeDefined();
		});
		await waitForSocketState(failSocket, failSocket.CLOSED);
	});

	// Tests to see if a Host can connect and receive data from the websocket
	test('Successful Connection', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', createRes.hostId);
		url.searchParams.set('token', createRes.token);
		hostSocket = new WebSocket(url);
		await waitForSocketState(hostSocket, WebSocket.OPEN);
		hostSocket.close();
		await waitForSocketState(hostSocket, WebSocket.CLOSED);
	});
});
