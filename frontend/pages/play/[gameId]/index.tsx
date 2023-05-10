import { apiCall } from '@/lib/api';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function JoinGame() {
	const router = useRouter();
	const { gameId, name } = router.query;
	const [error, setError] = useState('');

	async function tryToJoin() {
		const response = await apiCall('POST', `/games/${gameId}/players`, {
			name,
		});

		const { ok, id, err } = await response.json();
		if (!ok) {
			setError(err);
		} else {
			// we got an ID so redirect to the player page
			router.push(`/play/${gameId}/${id}`);
		}
	}

	useEffect(() => {
		console.log('effect running');
		(async () => {
			try {
				const response = await apiCall('POST', `/games/${gameId}/players`, {
					name,
				});

				const { ok, id, err } = await response.json();
				if (!ok) {
					setError(err);
				} else {
					// we got an ID so redirect to the player page
					router.push(`/play/${gameId}/${id}`);
				}
			} catch (e) {
				setError(`An error occurred communicating with the server.`);
				console.error(e);
			}
		})();
	}, [gameId, name, router]);

	// refactor AAAA
	// move to index event handler

	return (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<div className="flex w-full max-w-sm flex-col items-center justify-center">
				<div className="bg-gray-100 rounded-xl w-full p-10 mb-2 shadow-heavy">
					<h1 className="text-center text-2xl font-extrabold mb-4">
						{error.length > 0
							? 'An error occurred'
							: `Joining game ${gameId}...`}
					</h1>
					{error.length > 0 && <p className="text-center">{error}</p>}
				</div>
			</div>
		</main>
	);
}
