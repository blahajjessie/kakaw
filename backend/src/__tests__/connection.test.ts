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

// Tests if the same player/host can connect twice
describe('Multiple Connection Attempts', () => {
	// Set-Up Tests
	let hostSocket: WebSocket;
	let dupeSocket: WebSocket;
	let createRes: CreationResponse;
	test('Set-Up / Quiz Upload', async () => {
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

	test('Second Connection is Destroyed', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', createRes.hostId);
		url.searchParams.set('token', createRes.token);
		hostSocket = new WebSocket(url);
		await waitForSocketState(hostSocket, WebSocket.OPEN);
		dupeSocket = new WebSocket(url);

		await waitForSocketState(dupeSocket, WebSocket.CLOSED);
		hostSocket.close();
		await waitForSocketState(hostSocket, WebSocket.CLOSED);
	});
});

// Tests if server can receive client messages ok
describe('Client can Message Host', () => {
	// Set-Up Tests
	let hostSocket: WebSocket;
	let createRes: CreationResponse;
	test('Set-Up / Quiz Upload', async () => {
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

	test('Message Server', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', createRes.hostId);
		url.searchParams.set('token', createRes.token);
		hostSocket = new WebSocket(url);
		await waitForSocketState(hostSocket, WebSocket.OPEN);
		hostSocket.send(JSON.stringify({ ok: 'bongo' }));
	});

	test('Clean Up / Delete Game', async () => {
		await request
			.delete(`/games/${createRes.gameId}`)
			.set({ authorization: 'Bearer ' + createRes.token })
			.expect(200)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.ok).toBeDefined();
				expect(data.ok).toStrictEqual(true);
			});
		hostSocket.close();
		await waitForSocketState(hostSocket, WebSocket.CLOSED);
	});
});
