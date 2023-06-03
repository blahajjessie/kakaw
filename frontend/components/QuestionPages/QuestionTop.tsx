import Image from 'next/image';
import { useState, useEffect } from 'react';
import hourglass from 'public/hourglass.png';

import MatchMediaWrapper from '@/components/MatchMediaWrapper';

interface QuestionTopProps {
	qNum: number;
	qText: string;
	endTime: number;
	showContinue?: boolean;
}

export default function QuestionTop({
	qNum,
	qText,
	endTime,
	showContinue,
}: QuestionTopProps) {
	const delta = (endTime - Date.now()) / 1000;
	const [minutes, setMinutes] = useState(Math.floor((delta / 60) % 60));
	const [seconds, setSeconds] = useState(Math.floor(delta % 60));

	useEffect(() => {
		if (endTime === Infinity || delta === Infinity) {
			return;
		}

		let interval: ReturnType<typeof setInterval> | undefined = undefined;
		// wait for a fraction of a second
		const timeout = setTimeout(() => {
			interval = setInterval(() => {
				const delta = (endTime - Date.now()) / 1000;
				setMinutes(Math.floor((delta / 60) % 60));
				setSeconds(Math.floor(delta % 60));
			}, 1000);
		}, delta % 1);
		return () => {
			clearTimeout(timeout);
			if (interval !== undefined) {
				clearInterval(interval);
			}
		};
	}, [endTime, delta]);

	const mobileContent = (
		<div className="w-11/12 h-2/5 flex flex-col items-center justify-center font-extrabold text-xl">
			<div className="w-full flex flex-row items-center justify-between my-4">
				<div className="bg-orange-50 w-1/3 h-full flex flex-row items-center justify-center px-4 py-1 mr-2 rounded-xl text-center shadow-heavy">
					Q{qNum}
				</div>
				{endTime !== Infinity && (
					<div className="bg-gray-100 w-2/3 h-full flex flex-row items-center justify-end px-4 py-1 ml-2 rounded-xl shadow-heavy">
						<span className="flex flex-row items-center justify-end text-white">
							{minutes}:{seconds.toString().padStart(2, '0')}
						</span>
						<Image
							className="ml-2 shrink-0"
							alt="hourglass"
							src={hourglass}
							width={20}
						/>
					</div>
				)}
				{showContinue && (
					<button className="bg-orange-50 px-8 py-2 rounded-xl text-center cursor-pointer shadow-heavy hover:brightness-110">
						Continue
					</button>
				)}
			</div>
			<div className="w-full h-full bg-gray-100 grid items-center justify-center p-8 text-center overflow-auto text-2xl rounded-xl shadow-heavy">
				{qText}
			</div>
		</div>
	);

	const desktopContent = (
		<div className="bg-gray-100 w-full flex flex-row items-center justify-between font-extrabold shadow-heavy">
			<div className="w-32 bg-orange-50 shrink-0 flex flex-row items-center self-stretch pl-8 rounded-r-xl text-center text-3xl shadow-heavy 2xl:w-48 2xl:pl-12 2xl:text-4xl">
				Q{qNum}
			</div>
			<div className="w-full h-full max-h-20 text-lg text-center mx-4 px-4 py-6 overflow-auto xl:text-xl 2xl:text-2xl 2xl:py-8">
				{qText}
			</div>
			{endTime !== Infinity && (
				<div className="w-32 shrink-0 flex flex-row justify-end pr-8 text-3xl 2xl:w-48 2xl:pr-12 2xl:text-4xl">
					<span className="flex flex-row items-center justify-end text-white">
						{minutes}:{seconds.toString().padStart(2, '0')}
					</span>
					<Image
						className="ml-2 shrink-0"
						alt="hourglass"
						src={hourglass}
						width={30}
					/>
				</div>
			)}
			{showContinue && (
				<button className="bg-orange-50 px-8 py-2 mr-4 rounded-xl text-center cursor-pointer shadow-heavy hover:brightness-110">
					Continue
				</button>
			)}
		</div>
	);

	return (
		<MatchMediaWrapper
			mobileContent={mobileContent}
			desktopContent={desktopContent}
		/>
	);
}
