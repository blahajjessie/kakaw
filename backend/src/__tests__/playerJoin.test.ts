import httpServer from '../server';
import supertest from 'supertest';
import correct from './testTools/quizzes/correct.json';
import { CreationResponse } from './testTools/testDef';

let request: supertest.SuperTest<supertest.Test>;
let createRes: CreationResponse;

beforeAll(() => {
	request = supertest(httpServer);
});

afterAll((done) => {
	httpServer.close(done);
});

// Quiz Upload for the Purposes of Testing User Handling
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

// Player Object Creation
const badPlayer = {
	username: 1,
};

const player = {
	username: 'Jorge',
};

const emptyPlayer = {};

// User Handling Tests
test('Bad Request / Username is not a string', async () => {
	await request
		.post(`/games/${createRes.gameId}/players`)
		.send(badPlayer)
		.expect(400);
});

test('Bad Request / No Data in Request', async () => {
	await request.post(`/games/${createRes.gameId}/players`).expect(400);
});

test('Bad Request / No Data in Request', async () => {
	await request
		.post(`/games/${createRes.gameId}/players`)
		.send(emptyPlayer)
		.expect(400);
});

test('Game does not exist', async () => {
	await request.post('/games/AAAA/players').send(player).expect(404);
});

test('Successful Player Insert', async () => {
	await request
		.post(`/games/${createRes.gameId}/players`)
		.send(player)
		.expect(201);
});

test('Username Already Exists', async () => {
	await request
		.post(`/games/${createRes.gameId}/players`)
		.send(player)
		.expect(409);
});
