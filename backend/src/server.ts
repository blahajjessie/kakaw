import express from 'express';
import WebSocket from 'ws';

import * as code from './code';
import * as user from './user';
import { handleConnection } from './connection';

const app = express();
app.use(express.json());
const usedGame: string[] = [];
// used ids for both players and host
const usedId: string[] = [];
// first key is gameId
const games: Map<string, any> = new Map();
let open = -1;

app.get('/', (_req, res) => {
	res.send('Hello, world!');
});

app.post('/games', (req, res) => {
	try {
		let quizData = JSON.parse(req.body);
		const id = {
			gameId: code.gen(5, usedGame),
			hostId: code.gen(8, usedId),
		};
		// associate gameId with data and host
		const data = { quiz: quizData, host: id.hostId };
		games.set(id.gameId, data);
		res.send(id);
	} catch (e) {
		// client error
		console.error('Invalid JSON file:', e);
		res.status(400).send('Invalid JSON file');
	}
});

<<<<<<< HEAD
app.get('/games/:id/questions/:index/start', (req, res) => {
=======
app.post('/games/:gameId/players', (_req, res) => {
	user.userHandle(_req.params.gameId, _req, res);
});
app.get('/start', (req, res) => {
>>>>>>> quiz-grading
	const gameId = req.query.gameId as string;
	const hostId = req.query.hostId as string;
	const index = parseInt(req.params.index);
	const game = games.get(gameId);

	// client-requested game error
	if (game === undefined) {
		res.status(404).send(`Game ${gameId} not found`);
		return;
	}

	const host = game.host;
	// client permission error
	if (host !== hostId) {
		res.status(403).send(`Incorrect host of game ${gameId}`);
		return;
	}

	const quiz = game.quiz;
	// out-of-bounds error
	if (index >= quiz.questions.length) {
		res.status(404).send(`Question ${index} not found`);
		return;
	}

	// start accepting answers for the question index
	open = index;

	// show question text and answers on both host and player screens? 

	res.send({ ok: true });
});

app.post('/games/:id/questions/:index/answer', (req, res) => {
	const gameId = req.query.gameId as string;
	const index = parseInt(req.params.index);
	const game = games.get(gameId);

	// client-requested game error
	if (game === undefined) {
		res.status(404).send(`Game ${gameId} not found`);
		return;
	}

	const quiz = game.quiz;
	const question = quiz.questions[index];

	// check if question is open
	if (open != index) {
		res.status(400).send(`Question ${index} is not open for answers`);
		return;
	}

	// how to process answers? map w/ player ids and answers?

	// not accepting answers
	open = -1;
});

// create websocket "server" which really piggybacks on the express server
const webSocketServer = new WebSocket.Server({
	// if true, the ws library maintains a Set of all client connections
	// i'm leaving this false for now as it's overhead and i suspect we will have our own better way
	// to track clients by ID and whatnot
	clientTracking: false,
	// since this is true, ws will not listen for connections itself but instead we will forward
	// certain connections from express to ws
	noServer: true,
});

const httpServer = app.listen(8080);

httpServer.on('listening', () => {
	console.log('listening on localhost:8080');
});

// triggered when the client attempts to "upgrade" a connection from HTTP to WebSocket. we need to
// inform the ws library of this new connection.
// based on https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
httpServer.on('upgrade', (request, socket, head) => {
	const url = new URL(request.url!, `http://${request.headers.host}`);
	if (
		url.pathname != '/connect' ||
		!url.searchParams.has('gameId') ||
		!url.searchParams.has('playerId')
	) {
		// rude but no one should be trying to open websocket connections at other URLs
		socket.destroy();
	}
	const gameId = url.searchParams.get('gameId')!;
	const playerId = url.searchParams.get('playerId')!;

	webSocketServer.handleUpgrade(request, socket, head, (client, request) => {
		webSocketServer.emit('connection', client, request);
		handleConnection(client, gameId, playerId);
	});
});

export default httpServer;
