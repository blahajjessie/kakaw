interface QuestionAnswerProps {
	answers: [string, string, string, string];
}

export default function QuestionAnswers({ answers }: QuestionAnswerProps) {
	return (
		<div className="flex flex-wrap items-center justify-center grow gap-x-16 w-full font-extrabold text-3xl my-2 2xl:text-4xl">
			<div className="bg-red-400 flex items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center cursor-pointer hover:brightness-110">
				{answers[0]}
			</div>
			<div className="bg-green-400 flex items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center cursor-pointer hover:brightness-110">
				{answers[1]}
			</div>
			<div className="bg-blue-400 flex items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center cursor-pointer hover:brightness-110">
				{answers[2]}
			</div>
			<div className="bg-yellow-400 flex items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center cursor-pointer hover:brightness-110">
				{answers[3]}
			</div>
		</div>
	);
}
