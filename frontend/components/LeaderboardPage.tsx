import Image from 'next/image';
import Head from 'next/head';

import MatchMediaWrapper from '@/components/MatchMediaWrapper';
import LeaderboardEntry from '@/components/LeaderboardEntry';
import { LeaderboardEntry as LeaderboardEntryType } from '@/lib/useKakawGame';

import logo2 from 'public/logo2.png';
import { apiCall } from '@/lib/api';
import { useRouter } from 'next/router';

export interface LeaderboardPageProps {
	entries: LeaderboardEntryType[];
	index?: number;
	totalQuestions: number;
}

export default function LeaderboardPage({
	entries,
	index,
	totalQuestions,
}: LeaderboardPageProps) {
	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	const entriesList = entries.map((entry, i) => (
		<LeaderboardEntry
			key={`${entry.name}_${i}`}
			name={entry.name}
			score={entry.score}
			positionChange={entry.positionChange}
			isSelf={entry.isSelf}
		/>
	));

	async function endQuestion() {
		if (index === totalQuestions - 1) {
			try {
				await apiCall('POST', `/games/${gameId}/end`, null, {
					gameId,
					id: playerId,
				});
			} catch (e) {
				alert('Loading results page failed. Please try again');
				console.error(e);
			}
		} else {
			try {
				await apiCall(
					'POST',
					`/games/${gameId}/questions/${index! + 1}/start`,
					null,
					{ gameId: gameId, id: playerId }
				);
			} catch (e) {
				alert('Going to next question failed. Please try again');
				console.error(e);
			}
		}
	}

	const mobileContent = (
		<main className="w-full h-screen bg-purple-100 flex flex-col items-center justify-center font-extrabold">
			<Head>
				<title>Leaderboard - Kakaw!</title>
			</Head>
			<div className="w-11/12 h-full flex flex-col items-center justify-center">
				<Image alt="logo2" src={logo2} width={150} className="-mb-6" />
				<div className="w-min bg-gray-100 border border-black px-4 py-1 text-2xl z-20">
					Leaderboard
				</div>
				<div className="w-full h-2/3 bg-purple-500 px-8 py-14 -mt-6 text-lg rounded-3xl overflow-y-auto z-10">
					{entriesList}
				</div>
			</div>
		</main>
	);

	const desktopContent = (
		<main className="w-full h-screen bg-purple-100 flex flex-col items-center justify-center font-extrabold">
			{typeof index == 'number' && (
				<button
					className="absolute top-6 right-6 bg-purple-50 self-end px-8 py-2 rounded-lg text-xl text-white shadow-heavy hover:brightness-110 2xl:text-2xl"
					onClick={endQuestion}
				>
					Continue
				</button>
			)}
			<div className="w-4/5 h-full flex flex-col items-center justify-center">
				<Image alt="logo2" src={logo2} width={150} className="-mb-6" />
				<div className="w-min bg-gray-100 border border-black px-4 py-1 text-3xl z-20 2xl:text-4xl">
					Leaderboard
				</div>
				<div className="w-full h-2/3 bg-purple-500 p-14 -mt-6 text-lg rounded-xl overflow-y-auto z-10 2xl:text-xl">
					{entriesList}
				</div>
			</div>
		</main>
	);

	return (
		<MatchMediaWrapper
			mobileContent={mobileContent}
			desktopContent={desktopContent}
		/>
	);
}
