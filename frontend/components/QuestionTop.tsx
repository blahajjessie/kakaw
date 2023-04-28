import Image from 'next/image';
import { useState, useEffect } from 'react';
import hourglass from 'public/hourglass.png';

interface QuestionTopProps {
	qNum: number;
	qText: string;
	qTime: number;
}

export default function QuestionTop({ qNum, qText, qTime }: QuestionTopProps) {
	const [minutes, setMinutes] = useState(Math.floor((qTime / 60) % 60));
	const [seconds, setSeconds] = useState(Math.floor(qTime % 60));

	useEffect(() => {
		const interval = setInterval(() => {
			if (seconds === 0) {
				if (minutes !== 0) {
					setMinutes(minutes - 1);
					setSeconds(59);
				}
			} else {
				setSeconds(seconds - 1);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [seconds, minutes]);

	return (
		<div className="bg-gray-100 w-full flex flex-row items-center justify-between font-extrabold shadow-heavy">
			<div className="w-32 bg-orange-50 shrink-0 flex flex-row items-center self-stretch pl-8 rounded-r-xl text-center text-3xl shadow-heavy 2xl:w-48 2xl:pl-12 2xl:text-4xl">
				Q{qNum}
			</div>
			<div className="mx-2 px-4 py-6 text-lg text-center overflow-x-auto xl:text-xl 2xl:text-2xl 2xl:py-8">
				{qText}
			</div>
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
		</div>
	);
}
