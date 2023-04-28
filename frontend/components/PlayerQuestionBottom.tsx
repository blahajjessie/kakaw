interface PlayerQuestionBottomProps {
	name: string;
	score: number;
}

export default function QuestionTop({
	name,
	score,
}: PlayerQuestionBottomProps) {
	return (
		<div className="bg-gray-100 flex w-full flex-row items-center justify-between font-extrabold text-2xl 2xl:text-3xl">
			<div className="flex flex-col justify-center px-4 py-4 self-stretch text-center 2xl:py-5">
				{name}
			</div>
			<div className="flex flex-col justify-center px-4 py-4 self-stretch text-center 2xl:py-5">
				{score}
			</div>
		</div>
	);
}
