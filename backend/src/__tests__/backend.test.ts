import app from '../server';
import supertest from 'supertest';
import http from 'http';

let server: http.Server;
let request: supertest.SuperTest<supertest.Test>;

beforeAll(() => {
	server = http.createServer(app);
	server.listen();
	request = supertest(server);
});

afterAll((done) => {
	server.close(done);
});

test('GET Invalid URL', async () => {
	await request.get('/so-not-a-real-end-point-ba-bip-de-doo-da/').expect(404);
});
