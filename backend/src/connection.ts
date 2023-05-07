import { Game, UserId } from './gameTypes';

// first key is game ID, second key is player ID
// export const connections: Map<string, Map<string, WebSocket>> = new Map();

export function sendMessage(client: WebSocket, type: string, data: any) {
	client.send(JSON.stringify({ type, ...data }));
}

function killConnection(client: WebSocket, reason: string) {
	sendMessage(client, 'end', { reason });
	client.close();
}

export function handleConnection(
	connection: WebSocket,
	game: Game,
	playerId: UserId
) {
	
	console.log(
		`player ${playerId} attempting connection to game ${game.getQuizName()}`
	);

	// TODO: re-enable this condition, but refer to the games that currently exist, not the store of
	// clients connected to games. a game may still exist even if nobody is connected to it.
	// if (!connections.has(gameId)) {
	// 	return killConnection(connection, 'That game does not exist');
	// }



	// consider whether to allow this -- would need something like Map<string, Map<string, Array<WS>>>
	if (playersInGame.has(playerId)) {
		return killConnection(connection, 'You are already connected to this game');
	}
	playersInGame.set(playerId, connection);

	connection.send('hello, world!');
	connection.on('message', (data) => {
		console.log(`player ${playerId} says: ${data}`);
	});
	// handle when the player leaves or we close the connection
	connection.on('close', () => {
		console.log(`player ${playerId} disconnected`);
		playersInGame.delete(playerId);
		if (playersInGame.size == 0) {
			// clean up empty map
			connections.delete(gameId);
		}
	});
}
