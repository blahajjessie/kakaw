import { WebSocket } from 'ws';
import { gen } from './code';
import { ResponseData } from './respTypes';
import { sendMessage } from './connection';

// // for clarity, a gameID is just a string
export type UserId = string;

export class User {
	name: string;
	id: UserId
	connection: WebSocket | undefined = undefined;
	constructor(used:UserId[], name: string){
		this.id = gen(8, used);
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
		}
		return this.connection;
	}
	send(message: ResponseData){
		if (!this.connection) throw new Error('user not connected');

		if (this.connection.readyState === WebSocket.OPEN) {
			sendMessage(this.connection, ResponseData.name, message.data);
		}
		return;
	}
}

