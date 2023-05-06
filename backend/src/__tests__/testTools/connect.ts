import { WebSocket } from 'ws';

export function waitForSocketState(socket: WebSocket, state: number) {
	return new Promise<boolean>(function (resolve) {
		setTimeout(function () {
			if (socket.readyState === state) {
				resolve(true);
			} else {
				waitForSocketState(socket, state).then(resolve);
			}
		}, 10);
	});
}
