import express from 'express';
import * as code from './code';

const app = express();
const used: string[] = [];

app.get('/', (_req, res) => {
	res.send('Hello, world!');
});

app.get('/code', (_req, res) => {
	res.send(code.gen(5, used));
});

app.listen(8080).on('listening', () => {
	console.log('listening on localhost:8080');
});
