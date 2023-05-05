import Image from 'next/image';

import medal1 from '@/public/medal1.png';
import medal2 from '@/public/medal2.png';
import medal3 from '@/public/medal3.png';

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

	return (
		<main className="w-full h-screen bg-purple-100 bg-results bg-fixed bg-center bg-cover flex flex-row items-end justify-center font-extrabold text-3xl text-shadow shadow-gray-200">
			<div className="w-1/4 h-full flex flex-col items-center justify-end">
				<div className="text-white mb-0.5">{resultsEntries[1].name}</div>
				<div className="text-white mb-1">{resultsEntries[1].score}</div>
				<div className="w-full h-2/5 bg-gray-400 flex items-start justify-center p-8">
					<Image alt="medal 2" src={medal2} width={110} />
				</div>
			</div>
			<div className="w-1/4 h-full flex flex-col items-center justify-end">
				<div className="text-white mb-0.5">{resultsEntries[0].name}</div>
				<div className="text-white mb-1">{resultsEntries[0].score}</div>
				<div className="w-full h-2/3 bg-gray-100 flex items-start justify-center p-8">
					<Image alt="medal 1" src={medal1} width={120} />
				</div>
			</div>
			<div className="w-1/4 h-full flex flex-col items-center justify-end">
				<div className="text-white mb-0.5">{resultsEntries[2].name}</div>
				<div className="text-white mb-1">{resultsEntries[2].score}</div>
				<div className="w-full h-1/3 bg-gray-500 flex items-start justify-center p-8">
					<Image alt="medal 3" src={medal3} width={100} />
				</div>
			</div>
		</main>
	);
}
