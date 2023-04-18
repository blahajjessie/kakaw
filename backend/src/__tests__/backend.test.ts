import app from '../server';
import supertest from 'supertest';
import http from 'http';

let server: any;
let request: any;

beforeAll(() => {
    server = http.createServer(app);
    server.listen();
    request = supertest(server);
});
  
afterAll((done) => {
    server.close(done);
});

test('GET Invalid URL', async () => {
    await request.get('/so-not-a-real-end-point-ba-bip-de-doo-da/')
      .expect(404);
});
