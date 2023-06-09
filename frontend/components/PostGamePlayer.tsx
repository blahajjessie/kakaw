import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { PieChart } from 'react-minimal-pie-chart';

import postgame from 'public/postgame.png';
import { PostGameEntry } from '@/lib/useKakawGame';

export default function PostGamePlayer(props: PostGameEntry) {
	// Calculate the rank text based on % correct
	const rank = (() => {
		const total = props.numCorrect + props.numWrong;
		const percentCorrect = (100 * props.numCorrect) / total;

		if (percentCorrect === 100) {
			return 'Perfect!';
		} else if (percentCorrect >= 90) {
			return 'Awesome!';
		} else if (percentCorrect >= 80) {
			return 'Great!';
		} else if (percentCorrect >= 70) {
			return 'Nice!';
		} else {
			return 'Good try!';
		}
	})();

	return (
		<main className="w-full h-screen bg-purple-100 flex flex-col items-center justify-center font-extrabold">
			<Head>
				<title>Postgame Results - Kakaw!</title>
			</Head>
			<div className="w-4/5 h-full flex flex-col items-center justify-center">
				<Image
					alt="postgame logo"
					src={postgame}
					width={130}
					className="-mb-4"
				/>

				<div className="w-fit bg-gray-100 border border-black px-8 py-1 text-3xl z-20 2xl:text-4xl">
					How you did
				</div>

				<div className="w-full h-3/4 bg-purple-500 flex items-center justify-center p-8 pt-10 -mt-6 text-lg rounded-3xl z-10 sm:h-2/3 sm:p-12 sm:rounded-xl md:text-xl lg:text-2xl 2xl:text-3xl">
					<div className="w-full h-full flex flex-col items-center justify-around bg-gray-100 bg-opacity-50 rounded-xl shadow-heavy py-8 sm:flex-row sm:w-11/12 sm:py-0 md:px-8 lg:px-24 xl:px-36 2xl:px-40">
						<PieChart
							className="w-1/2 h-1/4 min-w-[3em] min-h-[3em] sm:w-1/4 sm:h-full md:w-1/5"
							radius={50}
							startAngle={-90}
							data={[
								{
									title: 'Correct',
									value: props.numCorrect,
									color: '#9EE09E',
								},
								{
									title: 'Incorrect or Unanswered',
									value: props.numWrong,
									color: '#FF6663',
								},
							]}
						/>

						<div className="flex flex-col items-center justify-center gap-4 text-black sm:gap-6 2xl:gap-10">
							<div className="w-2/3 bg-green-200 px-2 py-1 rounded-lg shadow-heavy sm:w-36 md:w-48 lg:w-52 2xl:w-64 2xl:px-4 2xl:py-2">
								Correct: {props.numCorrect}
							</div>
							<div className="w-2/3 bg-red-200 px-2 py-1 rounded-lg shadow-heavy sm:w-36 md:w-48 lg:w-52 2xl:w-64 2xl:px-4 2xl:py-2">
								Incorrect or Unanswered: {props.numWrong}
							</div>
						</div>

						<div className="w-fit bg-purple-500 border border-gray-200 px-4 py-1 rounded-lg text-white text-xl shadow-heavy md:text-2xl 2xl:text-4xl 2xl:px-6 2xl:py-2">
							{rank}
						</div>
					</div>
				</div>
			</div>

			<div className="w-3/4 flex justify-center gap-2 my-2">
				<Link
					href="/"
					className="grow bg-purple-50 self-end px-8 py-2 rounded-lg text-lg text-white text-center shadow-heavy hover:brightness-110 sm:absolute sm:top-6 sm:left-6 2xl:text-xl"
				>
					Quit
				</Link>
			</div>
		</main>
	);
}
