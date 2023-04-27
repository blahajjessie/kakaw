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

// Quiz Endpoint Tests
test('Correct Quiz Format', async () => {
	await request
		.post('/games')
		.send(correct)
		.expect(201)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.body).toBeDefined();
			expect(data.body.gameId).toBeDefined();
			expect(data.body.hostId).toBeDefined();
		});
});

test('Bad Request / No Data Sent', async () => {
	await request.post('/games').expect(400);
});

// Quiz Format Tests
const badFormat = {
	ooga: 'booga',
};

test('Wrong Quiz Format / Incorrect JSON', async () => {
	await request.post('/games').send(badFormat).expect(400);
});

const reallyBadFormat = '1001';

test('Wrong Quiz Format / String', async () => {
	await request.post('/games').send(reallyBadFormat).expect(400);
});
