import Image from 'next/image';
import Link from 'next/link';

import { PieChart } from 'react-minimal-pie-chart';

import MatchMediaWrapper from '@/components/MatchMediaWrapper';

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

	const mobileContent = (
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
					How you did
				</div>

				<div className="w-full h-2/3 bg-purple-500 flex items-center justify-center p-12 -mt-6 text-xl rounded-xl z-10 2xl:text-3xl">
					<div className="w-11/12 h-full flex flex-row items-center justify-center gap-16 bg-gray-100 bg-opacity-50 rounded-xl shadow-heavy 2xl:gap-20">
						<PieChart
							className="w-1/6"
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

						<div className="flex flex-col items-center justify-center gap-6 2xl:gap-10">
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

						<div className="w-fit bg-purple-500 border border-gray-200 px-4 py-1 rounded-lg text-white text-2xl shadow-heavy 2xl:text-4xl 2xl:px-6 2xl:py-2">
							{rank}
						</div>
					</div>
				</div>
			</div>
		</main>
	);

	const desktopContent = (
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
					How you did
				</div>

				<div className="w-full h-2/3 bg-purple-500 flex items-center justify-center p-12 -mt-6 text-xl rounded-xl z-10 2xl:text-3xl">
					<div className="w-11/12 h-full flex flex-row items-center justify-center gap-16 bg-gray-100 bg-opacity-50 rounded-xl shadow-heavy 2xl:gap-20">
						<PieChart
							className="w-1/6"
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

						<div className="flex flex-col items-center justify-center gap-6 2xl:gap-10">
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

						<div className="w-fit bg-purple-500 border border-gray-200 px-4 py-1 rounded-lg text-white text-2xl shadow-heavy 2xl:text-4xl 2xl:px-6 2xl:py-2">
							{rank}
						</div>
					</div>
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
