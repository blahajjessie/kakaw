import Image from 'next/image';
import TimerSetter from '@/components/Fixtures/TimerSetter';
import Qr from '@/components/Fixtures/QrCodeGeneration';
import { WEBPAGE_BASE_URL } from '@/lib/baseUrl';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import { apiCall } from '@/lib/api';
import { useState, useContext } from 'react';

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

const colors = [
	'bg-red-200',
	'bg-green-200',
	'bg-purple-350',
	'bg-blue-200',
	'bg-purple-300',
];

export default function HostWaiting({ gameId }: hostProps) {
	const [timeLimit, setTimeLimit] = useState<number>(15);
	const [maxPlayers, setMaxPlayers] = useState<number>(5);
	const playerList = useContext(playerListContext) as playerListContextType;
	const router = useRouter();

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

	const qrCode = Qr(gameId);

	return (
		<main
			className={`${inter.className} w-screen h-screen font-sans bg-purple-100 flex flex-col justify-between p-4`}
		>
			<div className="flex flex-row items-center justify-center sm:justify-start">
				<Image
					alt="Kakaw logo"
					className="mx-4 hidden sm:block"
					src={logo2}
					width={220}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
				<div className="bg-gray-100 flex flex-col sm:flex-row items-center justify-center sm:justify-between font-extrabold shadow-heavy rounded-xl p-3 sm:w-max">
					<div className="sm:mx-4">{qrCode}</div>
					<div className="flex flex-col items-center justify-center sm:mx-4">
						<div className="text-4xl 2xl:text-5xl whitespace-nowrap">
							Join with the code:
						</div>
						<div className="text-8xl 2xl:text-9xl">{gameId}</div>
						<div className="text-2xl 2xl:text-3xl whitespace-nowrap">
							at {WEBPAGE_BASE_URL}
						</div>
					</div>
					<div className="bg-white flex flex-col justify-center items-center rounded-xl p-4">
						<div className="text-4xl xl:text-5xl mb-2">Settings:</div>
						<div className="flex flex-row mt-2">
							<div className="flex flex-row p-1">
								<div className="flex flex-col items-center justify-center text-xl xl:text-2xl whitespace-nowrap mt-2 mr-2">
									<div className="mb-4">Time Limit:</div>
									<div className="mb-4">Max Players:</div>
								</div>
								<div className="flex flex-col items-center justify-center text-xl xl:text-2xl whitespace-nowrap">
									<TimerSetter
										initTimerValue={timeLimit}
										onChange={(v) => setTimeLimit(v)}
									/>
									<TimerSetter
										initTimerValue={maxPlayers}
										onChange={(v) => setMaxPlayers(v)}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="hidden sm:block w-max sm:w-full h-full py-2">
				<div className="absolute rounded-xl shadow-heavy bg-purple-50 text-4xl font-extrabold py-4 px-6 w-fit up-2">
					Participants
				</div>
				<div className="flex flex-col w-full h-full shadow-heavy rounded-xl bg-gray-100 bg-opacity-50 my-4 z-0">
					<div className="w-full h-full p-4">
						<table className="w-full border-separate border-spacing-y-3 text-2xl font-extrabold mt-14">
							<tbody>
								{displayPlayers.map((subArray, index) => (
									<tr
										className="border-separate border-spacing-y-2"
										key={index}
									>
										{subArray.map((player, i) => (
											<td key={index + i}>
												<div
													className={`text-white text-center w-52 rounded-xl py-1 ${
														colors[(i + index) % 5]
													}`}
												>
													{player}
												</div>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="flex flex-row justify-end m-2">
						<div className="rounded-xl bg-purple-100 text-2xl w-52 text-white text-center m-2 px-6 py-1">
							{playerList.length}/{maxPlayers}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-center items-center mt-4">
				<button
					className="bg-purple-50 hover:bg-gray-100 border-1 border-gray-200 rounded-xl mx-2 text-white text-center text-2xl shadow-heavy w-1/4 h-fit py-3"
					type="button"
					onClick={() => {
						router.back();
					}}
				>
					Back
				</button>
				<button
					className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl mx-2 text-white text-center text-2xl shadow-heavy w-2/3 h-fit py-3"
					type="button"
					onClick={() => {
						startQuiz();
					}}
				>
					Start
				</button>
			</div>
		</main>
	);
}
