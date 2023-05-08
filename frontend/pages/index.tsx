import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';

import logo from 'public/logo.png';
import Link from 'next/link';

export default function Home() {
	const [gameId, setGameId] = useState('');
	const [username, setUsername] = useState('');
	const router = useRouter();

	function isGameJoinable(): boolean {
		return /[0-9]{6}/g.test(gameId) && username.length > 0;
	}

	function joinGame() {
		if (!isGameJoinable()) {
			return;
		}

		router.push(`/play/${gameId}?name=${encodeURIComponent(username)}`);
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

				<form className="p-8 mb-2 w-4/5 sm:w-full">
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
						type="button"
						disabled={!isGameJoinable()}
						onClick={joinGame}
					>
						Join
					</button>
				</form>

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
