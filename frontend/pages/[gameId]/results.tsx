import Image from 'next/image';
import { Inter } from 'next/font/google';

import MatchMediaWrapper from '@/components/MatchMediaWrapper';
import results_background from '@/public/results_background.png';

const inter = Inter({ subsets: ['latin'] });

const resultsEntries = [
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
];

export default function ResultsPage() {
	resultsEntries.sort((a, b) => b.score - a.score);

	const mobileContent = (
		<main className="w-full h-screen bg-purple-100 flex flex-col items-center justify-center font-extrabold">
			<div className=""></div>
		</main>
	);

	const desktopContent = (
		<main className="w-full h-screen bg-purple-100 flex flex-col items-center justify-center font-extrabold">
			<div className=""></div>
		</main>
	);

	return (
		<MatchMediaWrapper
			mobileContent={mobileContent}
			desktopContent={desktopContent}
		/>
	);
}
