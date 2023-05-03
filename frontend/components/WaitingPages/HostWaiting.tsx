import Image from 'next/image';
import logo2 from '../public/logo2.png';
import { Inter } from 'next/font/google';
import { apiCall } from '@/lib/api';

import { ChangeEvent, useState } from 'react';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

export default function hostWaiting(hostId: number) {
	const [timeLimit, setTimeLimit] = useState<string | null>(null);
	const [maxPlayers, setMaxPlayers] = useState<string | null>(null);

	// Alters State of timeLimit for every change
	function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
		const newTime = e.target.textContent;
		setTimeLimit(newTime);
	}

	// Alters State of maxPlayers for every change
	function handlePlayerChange(e: ChangeEvent<HTMLInputElement>) {
		const newMax = e.target.textContent;
		setMaxPlayers(newMax);
	}

	async function startQuiz() {
		const { ok, err } = await apiCall(
			'POST',
			`/games/${hostId}/questions/0/start`
		)
			.then((res) => {
				if (!res.ok) {
					throw res;
				}
				return res.json();
			})
			.catch((err) => {
				alert(`Error starting game (${err}), please try again`);
			});
	}

	return (
		<main
			className={`${inter.variable} w-full font-sans bg-purple-100 flex flex-col p-8`}
		>
			<div className="flex flex-row items-center justify-center w-full">
				<div className="bg-gray-100 w-full flex flex-row items-center justify-between font-extrabold shadow-heavy rounded-xl p-8">
					<div>
						<div className="text-4xl">Join with the code:</div>
						<div className="text-8xl">XXXXX</div>
					</div>
					<div className="flex flex-col p-4">
						<div className="text-4xl">Options:</div>
						<div className="flex flex-row">
							<div className="flex flex-col text-2xl">
								<div>Time Limit:</div>
								<div>Max Players:</div>
							</div>
							<div className="flex flex-col p-4">
								<input
									className="flex flex-col"
									id="time"
									type="text"
									maxLength={3}
									onChange={handleTimeChange}
								/>
								<input
									className="flex flex-col"
									id="maxPlayers"
									type="text"
									maxLength={4}
									onChange={handlePlayerChange}
								/>
							</div>
						</div>
					</div>
					<button
						className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl p-8 mx-2 text-white text-center text-6xl shadow-md"
						type="button"
						onClick={() => {
							startQuiz;
						}}
					>
						Start
					</button>
				</div>
				<Image
					alt="Kakaw logo"
					src={logo2}
					width={189}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
			</div>
			<div className="flex flex-col items-start justify-start">
				<div className="text-4xl font-extrabold">Participants (x)</div>
				<div></div>
			</div>
		</main>
	);
}
