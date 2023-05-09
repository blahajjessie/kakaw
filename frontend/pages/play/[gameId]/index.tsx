import { apiCall } from '@/lib/api';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function JoinGame() {
	const router = useRouter();
	const { gameId, name } = router.query;

	useEffect(() => {}, []);

	return (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">
				<div className="bg-gray-100 rounded-xl w-full p-10 mb-2 shadow-heavy">
					<h1 className="text-center text-2xl">Joining game {gameId}...</h1>
				</div>
			</div>
		</main>
	);
}
