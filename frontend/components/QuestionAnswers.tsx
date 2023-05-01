import MatchMediaWrapper from '@/components/MatchMediaWrapper';

interface QuestionAnswerProps {
	answers: [string, string, string, string];
}

export default function QuestionAnswers({ answers }: QuestionAnswerProps) {
	const mobileContent = (
		<div className="w-11/12 h-2/3 flex flex-col justify-between font-extrabold text-lg my-2">
			<div className="w-full h-1/4 bg-red-400 flex items-center justify-center text-center rounded-xl p-4 my-2 overflow-y-auto shadow-heavy hover:brightness-110">
				{answers[0]}
			</div>
			<div className="w-full h-1/4 bg-green-400 flex items-center justify-center text-center rounded-xl p-4 my-2 overflow-y-auto shadow-heavy hover:brightness-110">
				{answers[1]}
			</div>
			<div className="w-full h-1/4 bg-blue-400 flex items-center justify-center text-center rounded-xl p-4 my-2 overflow-y-auto shadow-heavy hover:brightness-110">
				{answers[2]}
			</div>
			<div className="w-full h-1/4 bg-yellow-400 flex items-center justify-center text-center rounded-xl p-4 my-2 overflow-y-auto shadow-heavy hover:brightness-110">
				{answers[3]}
			</div>
		</div>
	);

	const desktopContent = (
		<div className="flex flex-wrap items-center justify-center grow gap-x-16 w-full font-extrabold text-3xl my-2 2xl:text-4xl">
			<div className="bg-red-400 flex items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center overflow-y-auto shadow-heavy cursor-pointer hover:brightness-110">
				{answers[0]}
			</div>
			<div className="bg-green-400 flex items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center overflow-y-auto shadow-heavy cursor-pointer hover:brightness-110">
				{answers[1]}
			</div>
			<div className="bg-blue-400 flex items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center overflow-y-auto shadow-heavy cursor-pointer hover:brightness-110">
				{answers[2]}
			</div>
			<div className="bg-yellow-400 flex items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center overflow-y-auto shadow-heavy cursor-pointer hover:brightness-110">
				{answers[3]}
			</div>
		</div>
	);

	return (
		<MatchMediaWrapper
			mobileContent={mobileContent}
			desktopContent={desktopContent}
		/>
	);
}
