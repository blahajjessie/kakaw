import MatchMediaWrapper from '@/components/MatchMediaWrapper';

const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200'];

interface StyledAnswersProps {
	answers: string[];
	containerClass: string;
	itemClass: string;
	onAnswer: (answer: number) => void;
}

function StyledAnswers({
	answers,
	containerClass,
	itemClass,
	onAnswer,
}: StyledAnswersProps) {
	return (
		<div className={containerClass}>
			{answers.map((answer, i) => (
				<div
					key={i}
					className={`${itemClass} ${colors[i]}`}
					onClick={() => onAnswer(i)}
				>
					{answer}
				</div>
			))}
		</div>
	);
}

export interface QuestionAnswerProps {
	answers: Array<string>;
	onAnswer: (answer: number) => void | Promise<void>;
}

export default function QuestionAnswers({
	answers,
	onAnswer,
}: QuestionAnswerProps) {
	const mobileContainerClass =
		'w-11/12 h-2/3 flex flex-col justify-between font-extrabold text-lg my-2';
	const mobileItemClass =
		'w-full h-1/4 grid items-center justify-center text-center rounded-xl p-4 my-2 overflow-y-auto shadow-heavy hover:brightness-110';

	const desktopContainerClass =
		'flex flex-wrap items-center justify-center grow gap-x-16 w-full font-extrabold text-3xl my-2 2xl:text-4xl';
	const desktopItemClass =
		'grid items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center overflow-y-auto shadow-heavy cursor-pointer hover:brightness-110';

	return (
		<MatchMediaWrapper
			mobileContent={
				<StyledAnswers
					answers={answers}
					containerClass={mobileContainerClass}
					itemClass={mobileItemClass}
					onAnswer={onAnswer}
				/>
			}
			desktopContent={
				<StyledAnswers
					answers={answers}
					containerClass={desktopContainerClass}
					itemClass={desktopItemClass}
					onAnswer={onAnswer}
				/>
			}
		/>
	);
}
