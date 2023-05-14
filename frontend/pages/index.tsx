import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

import logo from 'public/logo.png';
import { apiCall } from '@/lib/api';

export default function Home() {
	const [gameId, setGameId] = useState('');
	const [username, setUsername] = useState('');
	const [joining, setJoining] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	function isGameJoinable(): boolean {
		return /[0-9]{5}/g.test(gameId) && username.length > 0;
	}

	async function joinGame(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!isGameJoinable()) {
			return;
		}

		setJoining(true);

		let response;

		try {
			response = await apiCall('POST', `/games/${gameId}/players`, {
				username,
			});

			const { ok, id, err } = await response.json();
			if (!ok) {
				setError(err);
				setJoining(false);
			} else {
				// we got an ID so redirect to the player page
				console.log(`entering game: ${gameId}, ${id}`);
				router.push(`/play/${gameId}/${id}`);
			}
		} catch (e) {
			// TODO backend should communicate this better
			if (response?.status == 404) {
				setError(
					'That game does not exist. Make sure you typed the code correctly.'
				);
			} else if (response?.status == 409) {
				setError('Someone has already joined with that username.');
			} else {
				setError('An error occurred communicating with the server.');
			}
			setJoining(false);
			console.error(e);
		}
	}

	return (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">
				<Image
					alt="Kakaw logo"
					src={logo}
					width={200}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>

				<form className="p-8 mb-2 w-4/5 sm:w-full" onSubmit={joinGame}>
					<input
						className="bg-gray-100 border-1 border-gray-200 rounded-xl w-full px-4 py-2 mb-4 text-center text-lg shadow-md"
						id="code"
						type="text"
						placeholder="Code"
						maxLength={8}
						required
						value={gameId}
						onChange={(e) => setGameId(e.target.value)}
					/>
					<input
						className="bg-gray-100 border-1 border-gray-200 rounded-xl w-full px-4 py-2 mb-4 text-center text-lg shadow-md"
						id="username"
						type="text"
						placeholder="Username"
						maxLength={30}
						required
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<button
						className="bg-orange-200 hover:brightness-110 border-1 border-gray-200 rounded-xl w-full px-4 py-2 text-white text-center text-lg shadow-md"
						type="submit"
						disabled={!isGameJoinable() && !joining}
					>
						{joining ? 'Joining...' : 'Join'}
					</button>
				</form>

				{error != '' && <p className="text-center p-8">{error}</p>}

				<Link
					href="/upload"
					className="text-white cursor-pointer hover:underline"
				>
					Host your own Quiz!
				</Link>
			</div>
		</main>
	);
}
