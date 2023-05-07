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
	let hostSocket: WebSocket;
	let playerSocket: WebSocket;
	let playerId: string;
	const player = {
		username: 'Jorge',
	};
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
			});
	});

	test('Player Connect', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', playerId);
		playerSocket = new WebSocket(url);
		await waitForSocketState(playerSocket, playerSocket.OPEN);
	});

	test('Start Quiz', async () => {
		await request
			.post(`/games/${createRes.gameId}/questions/0/start`)
			.expect(200);
	});

    test('Close Player', async () => {
		playerSocket.close();
		await waitForSocketState(playerSocket, playerSocket.CLOSED);
	});

    test('Close Host', async () => {
		hostSocket.close();
		await waitForSocketState(hostSocket, hostSocket.CLOSED);
	});
});
