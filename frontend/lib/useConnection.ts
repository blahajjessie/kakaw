import { WEBSOCKET_BASE_URL } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useWebSocket from 'react-use-websocket';

export interface UseConnectionParams {
	onEvent: (type: string, event: any) => void;
	onError: (error: any) => void;
	onClose: (reason?: string) => void;
}

export default function useConnection({
	// extract the three functions, but rename them locally (i.e. onEvent -> onEventCallback) to
	// avoid confusion with the callbacks we pass into useWebSocket
	onEvent: onEventCallback,
	onError: onErrorCallback,
	onClose: onCloseCallback,
}: UseConnectionParams): void {
	const router = useRouter();
	const { gameId, playerId } = router.query;
	// if the server sends an 'end' message, we store the reason to pass later when the connection
	// is closed
	const [closeReason, setCloseReason] = useState<string | undefined>(undefined);

	if (typeof gameId != 'string' || typeof playerId != 'string') {
		throw new Error(
			'useConnection() must be called from a route with gameId and playerId parameters'
		);
	}

	// construct URL: /connect?gameId=...&playerId=...
	const url = new URL('/connect', WEBSOCKET_BASE_URL);
	url.searchParams.set('gameId', gameId);
	url.searchParams.set('playerId', playerId);

	useWebSocket(url.href, {
		onOpen() {
			console.log('WebSocket connection established.');
		},

		onMessage(event: MessageEvent<string>) {
			try {
				// this throws if event.data is not JSON at all
				const data = JSON.parse(event.data);
				// check if it is a JSON object (not array or single value or anything) containing
				// 'type' as a string
				if (
					data === null ||
					typeof data != 'object' ||
					typeof data.type != 'string'
				) {
					onErrorCallback(new Error('Got malformed JSON data from server'));
				}

				const type = data.type;
				if (type == 'end') {
					setCloseReason(data.reason);
				}

				onEventCallback(data.type, data);
			} catch (error) {
				onErrorCallback(new Error(`JSON parse error: ${error}`));
			}
		},

		onError(event) {
			onErrorCallback(event);
		},

		onClose() {
			onCloseCallback(closeReason);
		},
	});
}
