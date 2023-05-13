import Image from 'next/image';
import Link from 'next/link';

import postgame from 'public/postgame.png';

const postgameData = [
	{
		name: 'Player 1',
		correct: 16,
		wrong: 8,
		unanswered: 2,
	},
	{
		name: 'Player 2',
		correct: 20,
		wrong: 4,
		unanswered: 2,
	},
	{
		name: 'Player 3',
		correct: 20,
		wrong: 6,
		unanswered: 0,
	},
	{
		name: 'Player 4',
		correct: 15,
		wrong: 10,
		unanswered: 1,
	},
	{
		name: 'Player 5',
		correct: 24,
		wrong: 2,
		unanswered: 0,
	},
];

interface percentCounts {
	[percent: string]: number;
}

export default function PostgameHostPage() {
	// Build array of % correct as whole numbers for all players
	const percentCorrectArray = postgameData
		.map((p) => (100 * p.correct) / (p.correct + p.wrong + p.unanswered))
		.sort((a, b) => a - b)
		.map((p) => p.toFixed(0));

	// Create object mapping of % correct to number of occurrences
	const percentCounts = percentCorrectArray.reduce(
		(percentCounts: percentCounts, percent: string) => {
			percent in percentCounts
				? (percentCounts[percent] += 1)
				: (percentCounts[percent] = 1);
			return percentCounts;
		},
		{}
	);

	const histogram: JSX.Element[] = [];
	for (const p in percentCounts) {
		histogram.push(
			<div key={p}>
				<div
					className="bg-purple-100"
					style={{ height: `${percentCounts[p] * 100}px` }}
				></div>
				<div>{p}</div>
			</div>
		);
	}

	return (
		<main className="w-full h-screen bg-purple-100 flex flex-col items-center justify-center font-extrabold">
			<Link
				href="/"
				className="absolute top-6 left-6 bg-purple-50 self-end px-8 py-2 rounded-lg text-lg text-white shadow-heavy hover:brightness-110 2xl:text-xl"
			>
				Quit
			</Link>
			<button className="absolute top-6 right-48 bg-purple-50 self-end px-8 py-2 rounded-lg text-lg text-white shadow-heavy hover:brightness-110 2xl:text-xl 2xl:right-52">
				Export Quiz
			</button>
			<button className="absolute top-6 right-6 bg-purple-50 self-end px-8 py-2 rounded-lg text-lg text-white shadow-heavy hover:brightness-110 2xl:text-xl">
				Play Again
			</button>

			<div className="w-4/5 h-full flex flex-col items-center justify-center">
				<Image
					alt="postgame logo"
					src={postgame}
					width={130}
					className="-mb-4"
				/>

				<div className="w-fit bg-gray-100 border border-black px-8 py-1 text-3xl z-20 2xl:text-4xl">
					How the class did
				</div>

				<div className="w-full h-2/3 bg-purple-500 flex items-center justify-center p-12 -mt-6 text-xl rounded-xl z-10 2xl:text-3xl">
					<div className="w-11/12 h-full flex flex-row items-end justify-center gap-16 bg-gray-100 bg-opacity-50 rounded-xl shadow-heavy 2xl:gap-20">
						{histogram}
					</div>
				</div>
			</div>
		</main>
	);
}
