import Image from 'next/image';
import hourglass from 'public/hourglass.png';

interface QuestionTopProps {
	qNum: number;
	qText: string;
}

export default function QuestionTop({ qNum, qText }: QuestionTopProps) {
	return (
		<div className="bg-gray-100 flex w-full flex-row items-center font-extrabold">
			<div className="bg-orange-50 flex flex-col justify-center pl-8 pr-12 self-stretch rounded-r-xl text-center text-3xl">
				Q{qNum}
			</div>
			<div className="px-4 py-6 h-min grow text-2xl text-center">{qText}</div>
			<div className="flex flex-row px-4">
				<span className="flex flex-col justify-center mx-2 text-white text-2xl">
					0:10
				</span>
				<Image alt="hourglass" src={hourglass} width={30} />
			</div>
		</div>
	);
}
