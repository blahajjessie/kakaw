import httpServer from '../server';
import supertest from 'supertest';
import correct from './testTools/quizzes/correct.json';

import { WebSocket } from 'ws';
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

describe('Multiple Connection Attempts', () => {
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
				createRes = data.body;
			});
	});

	test('Second Connection is Destroyed', async () => {
		hostSocket = new WebSocket(
			`ws://localhost:8080/connect?gameId=${createRes.gameId}&playerId=${createRes.hostId}`
		);

		hostSocket.on('message', () => {
			dupeSocket = new WebSocket(
				`ws://localhost:8080/connect?gameId=${createRes.gameId}&playerId=${createRes.hostId}`
			);
			hostSocket.close();
		});

		await waitForSocketState(hostSocket, hostSocket.CLOSED);
		await waitForSocketState(dupeSocket, 3);
	});
});

describe('Client can Message Host', () => {
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
				createRes = data.body;
			});
	});

	test('Second Connection is Destroyed', async () => {
		hostSocket = new WebSocket(
			`ws://localhost:8080/connect?gameId=${createRes.gameId}&playerId=${createRes.hostId}`
		);

		hostSocket.on('message', () => {
			hostSocket.send(JSON.stringify({ok: 'bongo'}));
			hostSocket.close();
		});

		await waitForSocketState(hostSocket, hostSocket.CLOSED);
	});
});
