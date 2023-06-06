import MatchMediaWrapper from '@/components/MatchMediaWrapper';

interface PlayerQuestionBottomProps {
	name: string;
	score: number;
	scoreChange?: number;
}

export default function PlayerQuestionBottom({
	name,
	score,
	scoreChange,
}: PlayerQuestionBottomProps) {
	const mobileContent = (
		<div className="w-full h-1/10 bg-gray-100 flex flex-row justify-between rounded-t-xl font-extrabold text-lg">
			<div className="flex flex-col justify-center px-2 py-3 ml-4 self-stretch text-center">
				{name}
			</div>
			<div className="relative flex flex-col justify-center px-2 py-3 mr-4 self-stretch text-center">
				{scoreChange !== undefined && (
					<div className="absolute -top-3 -left-8 text-xl animate-bounce">
						+{scoreChange}
					</div>
				)}
				{score}
			</div>
		</div>
	);

	const desktopContent = (
		<div className="w-full bg-gray-100 flex flex-row items-center justify-between font-extrabold text-lg xl:text-xl 2xl:text-2xl">
			<div className="flex flex-col justify-center px-4 py-3 self-stretch text-center 2xl:py-4">
				{name}
			</div>
			<div className="relative flex flex-col justify-center px-4 py-3 self-stretch text-center 2xl:py-4">
				{scoreChange !== undefined && (
					<div className="absolute -top-3 -left-8 transition-opacity text-xl xl:text-2xl 2xl:text-3xl animate-bounce">
						+{scoreChange}
					</div>
				)}
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
