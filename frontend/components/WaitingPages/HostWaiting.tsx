import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Qr from '@/components/Fixtures/QrCodeGeneration';
import { FRONTEND_BASE_URL } from '@/lib/baseUrl';
import { apiCall } from '@/lib/api';
import { currentPlayersState } from '@/lib/useKakawGame';

import logo2 from '@/public/logo2.png';
import XMarkImage from 'public/remove1.png';
import { useRecoilState } from 'recoil';

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

export default function HostWaiting() {
	const [currentPlayers, setCurrentPlayers] =
		useRecoilState(currentPlayersState);

	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	async function deletePlayer(playerIdToDelete: string) {
		try {
			await apiCall(
				'DELETE',
				`/games/${gameId}/players/${playerIdToDelete}`,
				null,
				{
					gameId: gameId,
					id: playerId,
				}
			);
			const newCurrentPlayers = new Map(currentPlayers);
			newCurrentPlayers.delete(playerIdToDelete);
			setCurrentPlayers(newCurrentPlayers);
		} catch (e) {
			alert('Removing player failed. Please try again.');
			console.error(e);
		}
	}

	// Sends the Server a call to start the game
	// NOTE: The server does send json to respond
	async function startQuiz() {
		try {
			apiCall('POST', `/games/${gameId}/questions/0/start`, null, {
				gameId: gameId,
				id: playerId,
			});
		} catch (e) {
			alert('Error starting game. Please try again.');
			console.error(e);
		}
	}

	const playersArray = [...currentPlayers.entries()].map(([id, username]) => ({
		username,
		id,
	}));

	const qrCode = Qr(gameId);

	return (
		<main className="w-full h-screen bg-purple-100 flex flex-col p-4 font-extrabold">
			<Head>
				<title>Waiting Room - Kakaw!</title>
			</Head>
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
				<div className="bg-gray-100 flex flex-col sm:grow sm:flex-row items-center justify-center sm:justify-between font-extrabold shadow-heavy rounded-xl p-3">
					<div className="sm:mx-4">{qrCode}</div>
					<div className="flex flex-col grow items-center justify-center sm:mx-4">
						<div className="text-4xl 2xl:text-5xl whitespace-nowrap">
							Join with the code:
						</div>
						<div className="text-8xl 2xl:text-9xl">{gameId}</div>
						<div className="text-2xl 2xl:text-3xl whitespace-nowrap">
							at {FRONTEND_BASE_URL}
						</div>
					</div>
				</div>
			</div>
			<div className="w-full h-1/2 grow py-4">
				<div className="absolute rounded-xl shadow-heavy bg-purple-50 text-3xl py-3 px-6 w-fit">
					Participants
				</div>
				<div className="flex flex-col justify-between w-full h-full shadow-heavy rounded-xl bg-gray-100 bg-opacity-50 my-4">
					<div className="grid grid-cols-2 gap-y-4 w-full text-2xl p-4 overflow-auto mt-12 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
						{playersArray.map((player, index) => (
							<div
								className={`relative group w-56 text-white text-center rounded-xl px-4 py-1 ${
									colors[index % 5]
								}`}
								key={player.id}
							>
								<div className="w-full truncate">{player.username}</div>
								<Image
									src={XMarkImage}
									alt="X icon"
									className="hover:brightness-125 absolute -top-2 -right-2 w-6 h-6 cursor-pointer invisible group-hover:visible"
									onClick={async () => deletePlayer(player.id)}
								/>
							</div>
						))}
					</div>
					<div className="flex flex-row justify-end m-2">
						<div className="rounded-xl bg-purple-100 text-2xl w-52 text-white text-center m-2 px-6 py-1">
							{currentPlayers.size}{' '}
							{currentPlayers.size == 1 ? 'player' : 'players'}
						</div>
					</div>
				</div>
			</div>
			<div className="w-full flex flex-row justify-center items-center mt-4">
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
					className="grow bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl mx-2 text-white text-center text-2xl shadow-heavy h-fit py-3"
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
