import { WebSocket } from 'ws';

// // for clarity, a gameID is just a string
export type UserId = string;

export class User {
	name: string;
	connection: WebSocket | undefined = undefined;
	constructor(used:UserId[], name: string){
		this.name = name;
	}

	addWs(sock: WebSocket) {
		this.connection = sock;
	}
	removeWs() {
		this.connection = undefined;
	}
	getWs(): WebSocket | undefined {
		if (!this.connection) {
			return undefined;
			// throw new Error('user not connected');
		}
		return this.connection;
	}
	send(ResponseData){
		if (playerSocket.readyState === WebSocket.OPEN) {
			sendMessage(playerSocket, ResponseData.name, ResponseData.data);
		}
		return;
	}
}

