import express from 'express';
import { WebSocket } from 'ws';
import { handleConnection } from './connection';
import { generateToken, validateToken } from './auth';

const app = express();
app.use(express.json());

import registerGameRoutes from './gameRunner';
import { getGame, gameExist } from './game';
import { prefs } from './preferences';
registerGameRoutes(app);

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
const httpServer = app.listen(prefs.backendPort);

httpServer.on('listening', () => {
	console.log('listening on localhost:' + prefs.backendPort);
});

// triggered when the client attempts to "upgrade" a connection from HTTP to WebSocket. we need to
// inform the ws library of this new connection.
// based on https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
httpServer.on('upgrade', (request, socket, head) => {
	const url = new URL(request.url!, `http://${request.headers.host}`);
	if (
		url.pathname != '/connect' ||
		!url.searchParams.has('gameId') ||
		!url.searchParams.has('playerId') ||
		!url.searchParams.has('token')
	) {
		// rude but no one should be trying to open websocket connections at other URLs
		socket.destroy();
		return;
	}
	const gameId = url.searchParams.get('gameId')!;
	const playerId = url.searchParams.get('playerId')!;
	if (!gameExist(gameId)) {
		console.log(
			'Invalid game while trying to upgrade ws. PlayerId: ' +
				playerId +
				' GameId:' +
				gameId
		);
		socket.destroy();
		return;
	}
	const token = url.searchParams.get('token')!;
	const isValid = validateToken(gameId, playerId, token);
	if (!isValid) {
		console.log(
			'Invalid token while trying to upgrade ws. PlayerId: ' +
				playerId +
				' GameId:' +
				gameId
		);
		socket.destroy();
		return;
	}
	try {
		const game = getGame(gameId);
		webSocketServer.handleUpgrade(request, socket, head, (client, request) => {
			webSocketServer.emit('connection', client, request);
			handleConnection(client, game, playerId);
		});
	} catch (e) {
		console.log(e);
		socket.destroy();
		return;
	}
});

export default httpServer;
