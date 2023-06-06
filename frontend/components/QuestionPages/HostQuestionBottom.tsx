import MatchMediaWrapper from '@/components/MatchMediaWrapper';

interface HostQuestionBottomProps {
	numAnswered: number;
	numPlayers: number;
	onContinue: () => void;
	buttonText: string;
}

export default function HostQuestionBottom({
	numAnswered,
	numPlayers,
	onContinue,
	buttonText,
}: HostQuestionBottomProps) {
	const mobileContent = (
		<div className="w-full h-1/10 bg-gray-100 flex flex-row items-center justify-between rounded-t-xl font-extrabold text-lg">
			<div className="flex flex-col justify-center px-2 py-3 ml-4 self-stretch text-center">
				{numAnswered}/{numPlayers} Answered
			</div>
			<div
				className="bg-orange-50 px-6 py-3 rounded-l-xl rounded-t-xl text-center shadow-heavy hover:brightness-110"
				onClick={onContinue}
			>
				{buttonText}
			</div>
		</div>
	);

	const desktopContent = (
		<div className="w-full bg-gray-100 flex flex-row items-center justify-between font-extrabold text-lg xl:text-xl 2xl:text-2xl z-10">
			<div className="flex flex-col justify-center px-4 py-3 self-stretch text-center 2xl:py-4">
				{numAnswered}/{numPlayers} Answered
			</div>
			<div
				className="bg-orange-50 px-8 py-3 rounded-l-xl text-center cursor-pointer shadow-heavy hover:brightness-110 2xl:py-4"
				onClick={onContinue}
			>
				{buttonText}
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
