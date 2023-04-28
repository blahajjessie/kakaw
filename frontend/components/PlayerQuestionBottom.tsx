interface PlayerQuestionBottomProps {
	name: string;
	score: number;
}

export default function QuestionTop({
	name,
	score,
}: PlayerQuestionBottomProps) {
	return (
		<div className="bg-gray-100 flex w-full flex-row items-center justify-between font-extrabold text-lg xl:text-xl 2xl:text-2xl">
			<div className="flex flex-col justify-center px-4 py-3 self-stretch text-center 2xl:py-4">
				{name}
			</div>
			<div className="flex flex-col justify-center px-4 py-3 self-stretch text-center 2xl:py-4">
				{score}
			</div>
		</div>
	);
}
