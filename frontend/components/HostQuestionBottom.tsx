interface HostQuestionBottomProps {
	numAnswered: number;
	numPlayers: number;
}

export default function QuestionTop({
	numAnswered,
	numPlayers,
}: HostQuestionBottomProps) {
	return (
		<div className="bg-gray-100 flex w-full flex-row items-center justify-between font-extrabold text-lg xl:text-xl 2xl:text-2xl">
			<div className="flex flex-col justify-center px-4 py-3 self-stretch text-center 2xl:py-4">
				{numAnswered}/{numPlayers} Answered
			</div>
			<div className="bg-orange-50 px-8 py-3 rounded-l-xl text-center cursor-pointer shadow-heavy hover:brightness-110 2xl:py-4">
				End Guessing
			</div>
		</div>
	);
}
