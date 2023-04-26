import httpServer from '../server';
import supertest from 'supertest';
import correct from './testTools/correct.json';

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

const bad_format = {
	ooga: 'booga',
};

test('Wrong Quiz Format', async () => {
	await request.post('/games').send(bad_format).expect(400);
});

test('Correct Quiz Format', async () => {
	await request.post('/games')
	.send(correct)
	.expect(201)
	.then((data) => {
		expect(data).toBeDefined();
		expect(data.body).toBeDefined();
		expect(data.body.gameId).toBeDefined();
		expect(data.body.hostId).toBeDefined();
	  });
});
