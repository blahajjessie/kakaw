import express from 'express';
import WebSocket from 'ws';

import * as code from './code';
import * as user from './user';
import { handleConnection } from './connection';

const app = express();
const used: string[] = [];

app.get('/', (_req, res) => {
	res.send('Hello, world!');
});

app.get('/code', (_req, res) => {
	res.send(code.gen(5, used));
});

app.post('/games/:gameID/players', (_req, res) => {
	user.userHandle(_req.params.gameID, _req.body, res);
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

export default app;
