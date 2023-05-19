import Image from 'next/image';
import { Inter } from 'next/font/google';
import { apiCall } from '@/lib/api';
import qr from '@/components/qrCode';
import { ChangeEvent, useState, useContext } from 'react';

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
	const [timeLimit, setTimeLimit] = useState<number>(15);
	const [maxPlayers, setMaxPlayers] = useState<number>(5);
	const playerList = useContext(playerListContext) as playerListContextType;

	// Alters State of timeLimit for every change
	function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {}

	// Alters State of maxPlayers for every change
	function handlePlayerChange(e: ChangeEvent<HTMLInputElement>) {}

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

	const qrCode = qr(gameId);

	return (
		<main
			className={`${inter.className} w-full font-sans bg-purple-100 flex flex-col p-6`}
		>
			<div className="flex flex-row items-center justify-start">
				<Image
					alt="Kakaw logo"
					className="mx-4 hidden sm:block"
					src={logo2}
					width={284}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
				<div className="bg-gray-100 flex flex-col sm:flex-row items-center justify-center sm:justify-between font-extrabold shadow-heavy rounded-xl p-6 w-full sm:w-min">
					<div>{qrCode}</div>
					<div className="flex flex-col items-center justify-center">
						<div className="text-4xl xl:text-5xl whitespace-nowrap">
							Join with the code:
						</div>
						<div className="text-8xl xl:text-9xl">{gameId}</div>
						<div className="text-2xl xl:text-3xl whitespace-nowrap">
							at https://www.kakaw.com
						</div>
					</div>
					<div className="flex flex-col p-4">
						<div className="text-4xl p-2 xl:text-5xl">Settings:</div>
						<div className="flex flex-row">
							<div className="flex flex-row p-1">
								<div className="flex flex-col items-center justify-center text-xl xl:text-2xl whitespace-nowrap">
									<div className="mb-2">Time Limit:</div>
									<div className="mb-2">Max Players:</div>
								</div>
								<div className="flex flex-col items-center justify-center text-xl xl:text-2xl whitespace-nowrap">
									<div className="flex flex-row justify-between items-center rounded-xl border-2 border-gray-200 mb-2 mx-2 w-28 h-11">
										<button className="bg-white border-1 border-gray-200 rounded text-red-400 text-center w-7 h-8 mx-2">
											-
										</button>
										<div className="text-lg">{timeLimit}</div>
										<button className="bg-white border-1 border-gray-200 rounded text-green-400 text-center w-7 h-8 mx-2">
											+
										</button>
									</div>
									<div className="flex flex-row justify-between items-center rounded-xl border-2 border-gray-200 mb-2 mx-2 w-28 h-11">
										<button className="bg-white border-1 border-gray-200 rounded text-red-400 text-center w-7 h-8 mx-2">
											-
										</button>
										<div className="text-lg">{maxPlayers}</div>
										<button className="bg-white border-1 border-gray-200 rounded text-green-400 text-center w-7 h-8 mx-2">
											+
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-start justify-start w-full p-10 shadow-heavy rounded-xl">
				<div className="text-4xl font-extrabold py-4">Participants</div>
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
				<div>
					{playerList.length}/{maxPlayers}
				</div>
			</div>
			<button
				className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl mx-2 text-white text-center text-4xl xl:text-5xl shadow-heavy w-full h-5"
				type="button"
				onClick={() => {
					startQuiz;
				}}
			>
				Start
			</button>
		</main>
	);
}
