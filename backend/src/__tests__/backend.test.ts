import httpServer from '../server';
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;

beforeAll(() => {
	request = supertest(httpServer);
});

afterAll((done) => {
	httpServer.close(done);
});

test('GET Invalid URL', async () => {
	await request.get('/so-not-a-real-end-point-ba-bip-de-doo-da/').expect(404);
});

test('Code Generation', async () => {
	await request.get('/code').expect(200);
});

test('Bad Request', async () => {
	await request.post('/games/AAAAA/players')
		.expect(400);
});

const player = {
	'username': 'Jorge'
};

test('Game does not exist', async () => {
	await request.post('/games/AAAAA/players')
		.send(player)
		.set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
		.expect(404);
});
