import { useState } from 'react';
import Image from 'next/image';
import XMarkImage from 'public/remove1.png';
import CheckMarkImage from 'public/checkmark1.png';
import styles from '@/styles/flip.module.css';

const colors = [
	'bg-red-200',
	'bg-green-200',
	'bg-blue-200',
	'bg-yellow-200',
	'bg-purple-400',
	'bg-pink-400',
];

interface QuestionAnswersProps {
	answers: string[];
	explanations?: string[];
	onAnswerClick?: (answerIndex: number) => void | Promise<void>;
	playerAnswer?: number;
	correctAnswers?: number[];
}

export default function QuestionAnswers({
	answers,
	explanations,
	onAnswerClick,
	playerAnswer,
	correctAnswers,
}: QuestionAnswersProps) {
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
			// Call the onAnswerClick function if it exists
			if (onAnswerClick) {
				setFirstClickedAnswer(index);
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
		<div className="w-full flex flex-wrap items-center justify-center grow my-2 font-extrabold text-lg sm:text-2xl lg:text-3xl 2xl:text-4xl overflow-y-scroll">
			{answers.map((answer, index) => (
				<div
					key={index}
					className={`relative ${colors[index]} grid items-center justify-center rounded-xl w-full h-1/5 sm:w-2/5 sm:h-2/5 px-16 py-8 m-1 sm:m-3 text-center overflow-y-auto shadow-heavy cursor-pointer hover:brightness-110`}
					onClick={() => handleAnswerClick(index)}
					onMouseEnter={() => handleMouseEnter(index)}
					onMouseLeave={() => handleMouseLeave(index)}
				>
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
							<div className="w-full h-1/4 bg-orange-200 absolute bottom-0 left-0 flex justify-center items-center rounded-xl text-white shadow-heavy py-0.5">
								You Answered
							</div>
						)}

					{/* Display X or Y image if the current index matches selectedAnswerIndex */}
					{correctAnswers && (
						<div className="absolute top-0 right-0 h-12 w-12 sm:h-16 sm:w-16">
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
