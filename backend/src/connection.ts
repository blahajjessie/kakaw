import { WebSocket } from 'ws';

export function handleConnection(
	connection: WebSocket,
	gameId: string,
	playerId: string
) {
	console.log(`player ${playerId} connected to game ${gameId}`);
	connection.send('hello, world!');
	connection.on('message', (data) => {
		console.log(`player ${playerId} says: ${data}`);
	});
	connection.on('close', () => {
		console.log(`player ${playerId} disconnected`);
	});
}
