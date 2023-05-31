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

describe('WebSocket Connection Tests', () => {
	// Set Tests
	let hostSocket: WebSocket;
	let createRes: CreationResponse;
	test('Quiz Does Not Exist', async () => {
		const wrongSocket = new WebSocket(
			`ws://localhost:8080/connect?gameId=55555&playerId=55555`
		);
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
		hostSocket = new WebSocket(
			`ws://localhost:8080/connect?gameId=${createRes.gameId}&playerId=${createRes.hostId}`
		);
		await waitForSocketState(hostSocket, WebSocket.OPEN);
		hostSocket.close();
		await waitForSocketState(hostSocket, WebSocket.CLOSED);
	});
});
