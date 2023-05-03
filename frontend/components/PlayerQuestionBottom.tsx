import MatchMediaWrapper from '@/components/MatchMediaWrapper';

interface PlayerQuestionBottomProps {
	name: string;
	score: number;
}

export default function QuestionTop({
	name,
	score,
}: PlayerQuestionBottomProps) {
	const mobileContent = (
		<div className="w-full h-1/10 bg-gray-100 flex flex-row justify-between rounded-t-xl font-extrabold text-lg">
			<div className="flex flex-col justify-center px-2 py-3 ml-4 self-stretch text-center">
				{name}
			</div>
			<div className="flex flex-col justify-center px-2 py-3 mr-4 self-stretch text-center">
				{score}
			</div>
		</div>
	);

	const desktopContent = (
		<div className="w-full bg-gray-100 flex flex-row items-center justify-between font-extrabold text-lg xl:text-xl 2xl:text-2xl">
			<div className="flex flex-col justify-center px-4 py-3 self-stretch text-center 2xl:py-4">
				{name}
			</div>
			<div className="flex flex-col justify-center px-4 py-3 self-stretch text-center 2xl:py-4">
				{score}
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
