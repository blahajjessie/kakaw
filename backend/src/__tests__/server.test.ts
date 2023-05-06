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
let createRes: CreationResponse;
let hostSocket: WebSocket;

beforeAll(() => {
	request = supertest(httpServer);
});

afterAll((done) => {
	httpServer.close(done);
});

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

// Tests to see if a Host can connect and receive data from the websocket
test('Host WebSockets', async () => {
	hostSocket = new WebSocket(
		`ws://localhost:8080/connect?gameId=${createRes.gameId}&playerId=${createRes.hostId}`
	);
	hostSocket.on('message', function message() {
		hostSocket.close();
	});
	await waitForSocketState(hostSocket, hostSocket.CLOSED);
});
