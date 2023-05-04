import Image from 'next/image';
import { Inter } from 'next/font/google';
import { apiCall } from '@/lib/api';
import { ChangeEvent, useState, useContext } from 'react';

import logo2 from '@/public/logo2.png';
import {
	playerListContextType,
	playerListContext,
} from '@/components/Context/ShareContext';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

interface hostProps {
	hostId: string;
}

export default function HostWaiting({ hostId }: hostProps) {
	const [timeLimit, setTimeLimit] = useState<string | null>(null);
	const [maxPlayers, setMaxPlayers] = useState<string | null>(null);
	const playerList = useContext(playerListContext) as playerListContextType;

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

	// Sends the Server a call to start the game
	// NOTE: The server does send json to respond
	async function startQuiz() {
		apiCall('POST', `/games/${hostId}/questions/0/start`)
			.then((res) => {
				if (!res.ok) {
					throw res;
				}
				return;
			})
			.catch((err) => {
				alert(`Error starting game (${err}), please try again`);
			});
	}

	const displayPlayers: string[][] = [];
	for (let i = 0; i < playerList.length; i += 4) {
		const row = playerList.slice(i, i + 4);
		displayPlayers.push(row);
	}

	return (
		<main
			className={`${inter.variable} w-full font-sans bg-purple-100 flex flex-col p-8`}
		>
			<div className="flex flex-row items-center justify-center w-full">
				<div className="bg-gray-100 w-full flex flex-row items-center justify-between font-extrabold shadow-heavy rounded-xl p-6">
					<div>
						<div className="text-4xl">Join with the code:</div>
						<div className="text-8xl">{hostId}</div>
					</div>
					<div className="flex flex-col p-4">
						<div className="text-4xl p-2">Options:</div>
						<div className="flex flex-row">
							<div className="flex flex-row p-2">
								<div className="flex flex-col text-2xl">
									<div className="mb-2">Time Limit:</div>
									<div className="mb-2">Max Players:</div>
								</div>
								<div className="flex flex-col text-2xl px-3">
									<input
										className="w-28 mb-2"
										id="time"
										type="text"
										maxLength={3}
										onChange={handleTimeChange}
									/>
									<input
										className="w-28 mb-2"
										id="maxPlayers"
										type="text"
										maxLength={4}
										onChange={handlePlayerChange}
									/>
								</div>
							</div>
						</div>
					</div>
					<button
						className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl mx-2 text-white text-center text-4xl shadow-heavy w-48 h-20"
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
					className="p-8"
					src={logo2}
					width={189}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
			</div>
			<div className="flex flex-col items-start justify-start p-10">
				<div className="text-4xl font-extrabold py-4">
					Participants ({playerList.length})
				</div>
				<table className="w-full text-2xl font-extrabold">{displayPlayers.map((subArray, index) => (
					<tr key={index}>
						{subArray.map((player, i) => (
							<td className="py-2" key={index + i}>{player}</td>
						))}
					</tr>
				))}</table>
			</div>
		</main>
	);
}
