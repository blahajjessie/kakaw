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
	let hostSocket: WebSocket;
	let createRes: CreationResponse;
	let serverMessage: JSON;
	// Quiz Upload for the Purposes of Testing WebSocket Connections
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
		await waitForSocketState(hostSocket, hostSocket.OPEN);
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
		console.log(serverMessage);
	});

	test('Close Host', async () => {
		hostSocket.close();
		await waitForSocketState(hostSocket, hostSocket.CLOSED);
	});
});
