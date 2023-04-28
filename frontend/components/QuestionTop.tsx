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
		<div className="bg-gray-100 w-full flex flex-row items-center justify-between font-extrabold">
			<div className="w-32 bg-orange-50 flex flex-row items-center self-stretch pl-6 rounded-r-xl text-center text-3xl 2xl:w-48 2xl:pl-10 2xl:text-4xl">
				Q{qNum}
			</div>
			<div className="px-4 py-6 text-2xl text-center overflow-x-auto 2xl:text-3xl 2xl:py-8">
				{qText}
			</div>
			<div className="w-32 flex flex-row justify-end pr-6 text-3xl 2xl:w-48 2xl:pr-10 2xl:text-4xl">
				<span className="flex flex-row items-center justify-end text-white mr-2">
					{minutes}:{seconds.toString().padStart(2, '0')}
				</span>
				<Image alt="hourglass" src={hourglass} width={30} />
			</div>
			{/* <div className="rounded-l-xl"></div> */}
		</div>
	);
}
