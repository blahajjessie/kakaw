import httpServer from '../server';
import supertest from 'supertest';
import correct from './testTools/quizzes/correct.json';

let request: supertest.SuperTest<supertest.Test>;

beforeAll(() => {
	request = supertest(httpServer);
});

afterAll((done) => {
	httpServer.close(done);
});

// Quiz Object Creation

const badFormat = {
	ooga: 'booga',
};

const emptyJson = {};

const reallyBadFormat = '1001';

const noMeta = {
	questions: correct.questions,
};

const wrongMetaTypes = {
	meta: {
		title: correct.meta.title,
		author: 111,
		pointDefault: '15',
		timeDefault: '10',
	},
	questions: correct.questions,
};

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
test('Wrong Quiz Format / Incorrect JSON', async () => {
	await request.post('/games').send(badFormat).expect(400);
});

test('Wrong Quiz Format / Empty JSON', async () => {
	await request.post('/games').send(emptyJson).expect(400);
});

test('Wrong Quiz Format / String', async () => {
	await request.post('/games').send(reallyBadFormat).expect(400);
});

test('Wrong Quiz Format / No Meta Data', async () => {
	await request.post('/games').send(noMeta).expect(400);
});

test('Wrong Quiz Format / Wrong Meta Data', async () => {
	await request.post('/games').send(wrongMetaTypes).expect(400);
});
