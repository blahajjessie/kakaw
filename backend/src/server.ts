import express from 'express';

const app = express();

app.get('/', (_req, res) => {
	res.send('Hello, world!');
});

app.listen(8080).on('listening', () => {
	console.log('listening on localhost:8080');
});

export default app;