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
		<main className="w-full h-screen bg-purple-100 bg-results bg-fixed bg-center bg-cover flex flex-row items-end justify-center font-extrabold text-lg text-shadow sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
			<div className="w-1/3 h-full flex flex-col items-center justify-end sm:w-1/4">
				<div className="text-white">
					{resultsEntries[1].isSelf ? 'You' : resultsEntries[1].name}
				</div>
				<div className="text-white mb-1 2xl:mb-2">
					{resultsEntries[1].score}
				</div>
				<div className="w-full h-2/5 bg-gray-400 flex items-start justify-center pt-6 sm:pt-8">
					<div className="relative w-[6rem] h-[6rem] xl:w-[8rem] xl:h-[8rem] 2xl:w-[11rem] 2xl:h-[11rem]">
						<Image
							alt="medal 2"
							src={medal2}
							fill
							sizes="(max-width: 640px) 40vw,
              10vw"
							className="object-contain"
						/>
					</div>
				</div>
			</div>
			<div className="w-1/3 h-full flex flex-col items-center justify-end sm:w-1/4">
				<div className="text-white">
					{resultsEntries[0].isSelf ? 'You' : resultsEntries[0].name}
				</div>
				<div className="text-white mb-1 2xl:mb-2">
					{resultsEntries[0].score}
				</div>
				<div className="w-full h-2/3 bg-gray-100 flex items-start justify-center pt-6 sm:pt-8">
					<div className="relative w-[6.5rem] h-[6.5rem] xl:w-[8.6rem] xl:h-[8.6rem] 2xl:w-[12rem] 2xl:h-[12rem]">
						<Image
							alt="medal 1"
							src={medal1}
							fill
							sizes="(max-width: 640px) 40vw,
              10vw"
							className="object-contain"
						/>
					</div>
				</div>
			</div>
			<div className="w-1/3 h-full flex flex-col items-center justify-end sm:w-1/4">
				<div className="text-white">
					{resultsEntries[2].isSelf ? 'You' : resultsEntries[2].name}
				</div>
				<div className="text-white mb-1 2xl:mb-2">
					{resultsEntries[2].score}
				</div>
				<div className="w-full h-1/3 bg-gray-500 flex items-start justify-center pt-6 sm:pt-8">
					<div className="relative w-[5.5rem] h-[5.5rem] xl:w-[7.4rem] xl:h-[7.4rem] 2xl:w-[10rem] 2xl:h-[10rem]">
						<Image
							alt="medal 3"
							src={medal3}
							fill
							sizes="(max-width: 640px) 40vw,
              10vw"
							className="object-contain"
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
