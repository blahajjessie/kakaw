import { useState } from 'react';
import MatchMediaWrapper from '@/components/MatchMediaWrapper';
import Image from 'next/image';
import XMarkImage from 'public/remove1.png';
import CheckMarkImage from 'public/checkmark1.png';
import styles from '@/styles/flip.module.css';

const colors = [
	'bg-red-400',
	'bg-green-400',
	'bg-blue-400',
	'bg-yellow-400',
	'bg-purple-400',
	'bg-pink-400',
];

type StyledAnswersProps = QuestionAnswersProps & {
	containerClass: string;
};

function StyledAnswers({
	containerClass,
	answers,
	explanations,
	onAnswerClick,
	playerAnswer,
	correctAnswers,
}: StyledAnswersProps) {
	// which answer the player clicked most recently -- could be their answer, or they could be
	// viewing an explanation
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
		playerAnswer ?? null
	);
	const [isHovering, setIsHovering] = useState(false);

	// which answer the player actually chose
	const [firstClickedAnswer, setFirstClickedAnswer] = useState<number | null>(
		playerAnswer ?? null
	);

	const handleAnswerClick = (index: number) => {
		// Update the firstClickedAnswer state if it is currently null
		if (firstClickedAnswer === null) {
			setFirstClickedAnswer(index);
			// Call the onAnswerClick function if it exists
			if (onAnswerClick) {
				onAnswerClick(index);
			}
		}

		// Always update the selectedAnswer state for the clicked answer
		setSelectedAnswer(index);
	};

	const getAnswerText = (index: number) => {
		// Check if the clicked answer matches the selectedAnswer state and return the appropriate text
		if (selectedAnswer === index && explanations) {
			return explanations[index];
		} else {
			return answers[index];
		}
	};

	//Handling hover feature
	const handleMouseEnter = (index: number) => {
		if (index === firstClickedAnswer) {
			setIsHovering(true);
		}
	};

	const handleMouseLeave = (index: number) => {
		if (index === firstClickedAnswer) {
			setIsHovering(false);
		}
	};

	return (
		<div className={containerClass}>
			{answers.map((answer, index) => (
				<div
					key={index}
					className={`relative ${colors[index]} grid items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center overflow-y-auto shadow-heavy cursor-pointer hover:brightness-110`}
					onClick={() => handleAnswerClick(index)}
					onMouseEnter={() => handleMouseEnter(index)}
					onMouseLeave={() => handleMouseLeave(index)}
				>
					{/* Flip Animation */}
					<div
						className={`${styles['answer-container']} ${
							selectedAnswer === index ? styles.flip : ''
						}`}
					>
						<div className={styles.answer}>{getAnswerText(index)}</div>
					</div>

					{/* Display Your Answer Rectangle if the current index matches selectedAnswerIndex */}
					{index === firstClickedAnswer &&
						selectedAnswer !== null &&
						!isHovering && (
							<div
								className="absolute bottom-0 left-0 flex justify-center items-center"
								style={{
									width: '100%',
									height: '25%',
									background: '#FF7200',
									boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
									borderRadius: '15px',
								}}
							>
								<p style={{ color: 'white', fontSize: '30px' }}>You Answered</p>
							</div>
						)}

					{/* Display X or Y image if the current index matches selectedAnswerIndex */}
					{correctAnswers && (
						<div className="absolute top-0 right-0 h-16 w-16">
							<Image
								src={
									correctAnswers.includes(index) ? CheckMarkImage : XMarkImage
								}
								alt="Selected Image"
								className="w-full h-full"
							/>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

interface QuestionAnswersProps {
	answers: string[];
	explanations?: string[];
	onAnswerClick?: (answerIndex: number) => void | Promise<void>;
	playerAnswer?: number;
	correctAnswers?: number[];
}

export default function QuestionAnswers(props: QuestionAnswersProps) {
	const mobileContainerClass =
		'w-11/12 h-2/3 flex flex-col justify-between font-extrabold text-lg my-2';

	const desktopContainerClass =
		'flex flex-wrap items-center justify-center grow gap-x-16 w-full font-extrabold text-3xl my-2 2xl:text-4xl';

	// Render the appropriate content based on the screen size
	return (
		<MatchMediaWrapper
			mobileContent={
				<StyledAnswers {...props} containerClass={mobileContainerClass} />
			}
			desktopContent={
				<StyledAnswers {...props} containerClass={desktopContainerClass} />
			}
		/>
	);
}
