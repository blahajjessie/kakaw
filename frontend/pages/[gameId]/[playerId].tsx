import { WEBSOCKET_BASE_URL } from '@/lib/api';
import { useRouter } from 'next/router';
import React from 'react';
import useWebSocket from 'react-use-websocket';

function ConnectPage() {
	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	const url = new URL('/connect', WEBSOCKET_BASE_URL);
	url.searchParams.set('gameId', gameId);
	url.searchParams.set('playerId', playerId);

	useWebSocket(url.href, {
		onOpen: () => {
			console.log('WebSocket connection established.');
		},

		onMessage: (event: MessageEvent<string>) => {
			try {
				const data = JSON.parse(event.data);
				console.log(data);
			} catch (error) {
				console.error('got invalid message from server:', error, event);
			}
		},
	});

	// render the page component with the query parameters
	return (
		<div>
			<h1>Connect Page</h1>
			<p>Game ID: {gameId}</p>
			<p>Player ID: {playerId}</p>
		</div>
	);
}

export default ConnectPage;
