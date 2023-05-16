import Image from 'next/image';
import Link from 'next/link';

import { PieChart } from 'react-minimal-pie-chart';

import postgame from 'public/postgame.png';

const postgameData = {
	name: 'Player 1',
	correct: 16,
	wrong: 8,
	unanswered: 2,
};

export default function PostgamePlayerPage() {
	// Calculate the rank text based on % correct
	const rank = (() => {
		const total =
			postgameData.correct + postgameData.wrong + postgameData.unanswered;
		const percentCorrect = (100 * postgameData.correct) / total;

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

				<div className="w-full h-3/4 bg-purple-500 flex items-center justify-center p-8 pt-10 -mt-6 text-lg rounded-3xl z-10 sm:h-2/3 sm:p-12 sm:rounded-xl md:text-xl 2xl:text-3xl">
					<div className="w-full h-full flex flex-col items-center justify-around bg-gray-100 bg-opacity-50 rounded-xl shadow-heavy py-8 sm:flex-row sm:w-11/12 sm:py-0 md:px-8 lg:px-24 xl:px-36 2xl:px-40">
						<PieChart
							className="w-1/2 h-1/4 min-w-[3em] min-h-[3em] sm:w-1/4 sm:h-full md:w-1/5"
							radius={50}
							startAngle={-90}
							data={[
								{
									title: 'Correct',
									value: postgameData.correct,
									color: '#9EE09E',
								},
								{
									title: 'Wrong',
									value: postgameData.wrong,
									color: '#FF6663',
								},
								{
									title: 'Unanswered',
									value: postgameData.unanswered,
									color: '#FDFD97',
								},
							]}
						/>

						<div className="flex flex-col items-center justify-center gap-4 sm:gap-6 2xl:gap-10">
							<div className="w-fit bg-green-200 px-2 py-1 rounded-lg text-white shadow-heavy 2xl:px-4 2xl:py-2">
								Correct: {postgameData.correct}
							</div>
							<div className="w-fit bg-red-200 px-2 py-1 rounded-lg text-white shadow-heavy 2xl:px-4 2xl:py-2">
								Wrong: {postgameData.wrong}
							</div>
							<div className="w-fit bg-yellow-200 px-2 py-1 rounded-lg text-gray-200 shadow-heavy 2xl:px-4 2xl:py-2">
								Unanswered: {postgameData.unanswered}
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
				<button className="grow bg-purple-50 self-end px-8 py-2 rounded-lg text-lg text-white text-center shadow-heavy hover:brightness-110 2xl:text-xl sm:absolute sm:top-6 sm:right-48 2xl:right-52">
					Export Quiz
				</button>
			</div>
			<button className="w-3/4 self-center bg-purple-50 self-end px-8 py-2 mb-2 rounded-lg text-lg text-white text-center shadow-heavy hover:brightness-110 sm:absolute sm:top-6 sm:right-6 sm:w-fit 2xl:text-xl">
				Play Again
			</button>
		</main>
	);
}
