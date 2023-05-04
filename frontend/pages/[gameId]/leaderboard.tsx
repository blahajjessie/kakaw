import Image from 'next/image';
import { Inter } from 'next/font/google';

import MatchMediaWrapper from '@/components/MatchMediaWrapper';
import LeaderboardEntry from '@/components/LeaderboardEntry';

import logo2 from 'public/logo2.png';

const inter = Inter({ subsets: ['latin'] });

const leaderboardEntries = [
	{
		name: 'Player 1',
		score: 2000,
		positionChange: 1,
		isSelf: false,
	},
	{
		name: 'Player 2',
		score: 1500,
		positionChange: -1,
		isSelf: true,
	},
	{
		name: 'Player 3',
		score: 1100,
		positionChange: 0,
		isSelf: false,
	},
	{
		name: 'Player 4',
		score: 800,
		positionChange: 2,
		isSelf: false,
	},
	{
		name: 'Player 5',
		score: 700,
		positionChange: -1,
		isSelf: false,
	},
	{
		name: 'Player 6',
		score: 700,
		positionChange: -1,
		isSelf: false,
	},
];

export default function LeaderboardPage() {
	leaderboardEntries.sort((a, b) => b.score - a.score);

	const entriesList = leaderboardEntries.map((entry, i) => (
		<LeaderboardEntry
			key={`${entry.name}_${i}`}
			name={entry.name}
			score={entry.score}
			positionChange={entry.positionChange}
			isSelf={entry.isSelf}
		/>
	));

	const mobileContent = (
		<main className="w-full h-screen bg-purple-100 flex flex-col items-center justify-center font-extrabold">
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
			<button className="absolute top-6 right-6 bg-purple-50 self-end px-8 py-2 rounded-lg text-xl text-white shadow-heavy hover:brightness-110 2xl:text-2xl">
				Continue
			</button>
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
