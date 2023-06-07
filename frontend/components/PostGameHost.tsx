import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import postgame from 'public/postgame.png';
import { PostGameEntry } from '@/lib/useKakawGame';

interface percentCounts {
	[percent: string]: number;
}

export interface PostGameHostProps {
	players: PostGameEntry[];
}

export default function PostGameHost({ players }: PostGameHostProps) {
	// Build array of % correct as whole numbers for all players
	const percentCorrectArray = players.map(
		(p) => (100 * p.numCorrect) / (p.numCorrect + p.numWrong)
	);

	// Create object mapping of % correct to number of occurrences
	const percentCounts = percentCorrectArray
		.sort((a, b) => a - b)
		.map((p) => p.toFixed(0))
		.reduce((percentCounts: percentCounts, percent: string) => {
			percent in percentCounts
				? (percentCounts[percent] += 1)
				: (percentCounts[percent] = 1);
			return percentCounts;
		}, {});

	// Generate histogram view
	const maxCount = Math.max(...Object.values(percentCounts));
	const barWidth = 80 / Object.keys(percentCounts).length;
	const histogram: JSX.Element[] = [];
	for (const p in percentCounts) {
		histogram.push(
			<div
				key={p}
				className="h-4/5 flex flex-col items-center justify-end"
				style={{
					width: `${barWidth}%`,
				}}
			>
				<div
					className="w-full bg-purple-500"
					style={{
						height: `${(70 * percentCounts[p]) / maxCount}%`,
					}}
				></div>
				<div className="text-white text-base 2xl:text-xl">{p}%</div>
			</div>
		);
	}

	// Calculate average score
	const averagePercentCorrect = (
		percentCorrectArray.reduce((a, b) => a + b) / percentCorrectArray.length
	).toFixed(0);

	return (
		<main className="w-full h-screen bg-purple-100 flex flex-col items-center justify-center font-extrabold">
			<Head>
				<title>Postgame Results - Kakaw!</title>
			</Head>
			<Link
				href="/"
				className="absolute top-6 left-6 bg-purple-50 self-end px-8 py-2 rounded-lg text-lg text-white shadow-heavy hover:brightness-110 2xl:text-xl"
			>
				Quit
			</Link>
			<button className="absolute top-6 right-48 bg-purple-50 self-end px-8 py-2 rounded-lg text-lg text-white shadow-heavy hover:brightness-110 2xl:text-xl 2xl:right-52">
				Export Quiz
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
					<div className="relative w-11/12 h-full flex flex-row items-center justify-center bg-gray-100 bg-opacity-50 pb-4 rounded-xl shadow-heavy 2xl:pb-8">
						<div className="absolute top-6 right-6 border border-gray-100 bg-purple-500 px-2 py-1 rounded-lg text-base text-white text-center shadow-heavy z-20 2xl:text-lg 2xl:px-4 2xl:py-2">
							Average score:
							<br />
							<span className="text-xl 2xl:text-2xl">
								{averagePercentCorrect}%
							</span>
						</div>
						<div className="w-2/3 h-full flex flex-row items-end justify-center gap-2 z-10">
							{histogram}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
