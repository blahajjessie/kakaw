import Image from 'next/image';
import { Inter } from 'next/font/google';
import { apiCall } from '@/lib/api';
import { ChangeEvent, useState, useContext } from 'react';
import MatchMediaWrapper from '@/components/MatchMediaWrapper';

import logo2 from '@/public/logo2.png';
import {
	playerListContextType,
	playerListContext,
} from '@/components/Context/ShareContext';

const inter = Inter({
	subsets: ['latin'],
});

interface hostProps {
	gameId: string;
}

export default function HostWaiting({ gameId }: hostProps) {
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
		apiCall('POST', `/games/${gameId}/questions/0/start`)
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

	const headerContent = (
		<div className="flex flex-col p-4">
			<div className="text-4xl p-2 xl:text-5xl">Options:</div>
			<div className="flex flex-row">
				<div className="flex flex-row p-1">
					<div className="flex flex-col text-xl xl:text-2xl whitespace-nowrap">
						<div className="mb-2">Time Limit:</div>
						<div className="mb-2">Max Players:</div>
					</div>
					<div className="flex flex-col text-xl px-2">
						<div className="flex flex-row">
							<input
								className="w-10 mb-2"
								id="time"
								type="text"
								maxLength={3}
								onChange={handleTimeChange}
							/>
							<div className="px-2">Seconds</div>
						</div>
						<input
							className="w-32 mb-2"
							id="maxPlayers"
							type="text"
							maxLength={4}
							onChange={handlePlayerChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);

	const desktopContent = (
		<div className="flex flex-row items-center justify-start">
			<div className="bg-gray-100 flex flex-row items-center justify-between font-extrabold shadow-heavy rounded-xl p-6 w-min">
				<div>
					<div className="text-4xl xl:text-5xl whitespace-nowrap">
						Join with the code:
					</div>
					<div className="text-8xl xl:text-9xl">{gameId}</div>
				</div>
				{headerContent}
				<button
					className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl mx-2 text-white text-center text-4xl xl:text-5xl shadow-heavy w-48 h-20"
					type="button"
					onClick={() => {
						startQuiz();
					}}
				>
					Start
				</button>
			</div>
			<Image
				alt="Kakaw logo"
				className="mx-4"
				src={logo2}
				width={189}
				style={{
					maxWidth: '100%',
					height: 'auto',
				}}
			/>
		</div>
	);

	const mobileContent = (
		<div className="bg-gray-100 w-full flex flex-col items-center justify-center font-extrabold shadow-heavy rounded-xl p-4">
			<div className="flex flex-col items-center justify-center">
				<div className="text-4xl">Join with the code:</div>
				<div className="text-8xl">{gameId}</div>
			</div>
			{headerContent}
			<button
				className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl mx-2 text-white text-center text-4xl shadow-heavy w-48 h-20"
				type="button"
				onClick={() => {
					startQuiz();
				}}
			>
				Start
			</button>
		</div>
	);

	return (
		<main
			className={`${inter.className} w-full font-sans bg-purple-100 flex flex-col p-6`}
		>
			<MatchMediaWrapper
				mobileContent={mobileContent}
				desktopContent={desktopContent}
			/>
			<div className="flex flex-col items-start justify-start p-10">
				<div className="text-4xl font-extrabold py-4">
					Participants ({playerList.length})
				</div>
				<table className="w-full text-2xl font-extrabold">
					{displayPlayers.map((subArray, index) => (
						<tr key={index}>
							{subArray.map((player, i) => (
								<td className="py-4" key={index + i}>
									{player}
								</td>
							))}
						</tr>
					))}
				</table>
			</div>
		</main>
	);
}
