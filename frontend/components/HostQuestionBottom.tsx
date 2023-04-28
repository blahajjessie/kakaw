interface HostQuestionBottomProps {
	numAnswered: number;
	numPlayers: number;
}

export default function QuestionTop({
	numAnswered,
	numPlayers,
}: HostQuestionBottomProps) {
	return (
		<div className="bg-gray-100 flex w-full flex-row items-center justify-between font-extrabold text-2xl">
			<div className="flex flex-col justify-center px-4 py-4 self-stretch text-center">
				{numAnswered}/{numPlayers} Answered
			</div>
			<div className="bg-orange-50 px-8 py-4 rounded-l-xl text-center cursor-pointer hover:brightness-110">
				End Guessing
			</div>
		</div>
	);
}
