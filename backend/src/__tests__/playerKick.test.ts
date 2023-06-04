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

describe('Kick Player', () => {
	// Set-Up Tests
	let createRes: CreationResponse;
	let playerSocket: WebSocket;
	const player = {
		username: 'Jorge',
		id: '',
		token: '',
	};
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

	test('Player Insert', async () => {
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
			});
	});

	test('Player Connect', async () => {
		const url = new URL('/connect', WEBSOCKET_BASE_URL);
		url.searchParams.set('gameId', createRes.gameId);
		url.searchParams.set('playerId', player.id);
		url.searchParams.set('token', player.token);
		playerSocket = new WebSocket(url);
		await waitForSocketState(playerSocket, WebSocket.OPEN);
	});

	// Kick Player
	test('Failure / Player Kick', async () => {
		await request
			.delete(`/games/${createRes.gameId}/players/${player.id}5`)
			.set({ authorization: 'Bearer ' + createRes.token })
			.expect(400);
	});

	test('Player Kick', async () => {
		await request
			.delete(`/games/${createRes.gameId}/players/${player.id}`)
			.set({ authorization: 'Bearer ' + createRes.token })
			.expect(200);
		await waitForSocketState(playerSocket, WebSocket.CLOSED);
	});
});
