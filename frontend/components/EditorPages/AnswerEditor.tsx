import Image from 'next/image';
import { useState } from 'react';

import { QuizQuestion } from '@/../backend/src/quiz';

import editor_plus from '@/public/editor_plus.svg';
import editor_minus from '@/public/editor_minus.svg';

interface AnswerEditorProps {
	question: QuizQuestion;
	answerIndex: number;
	color: string;
	onEdit: (question: Partial<QuizQuestion>) => void;
}

export default function AnswerEditor({
	question,
	answerIndex,
	color,
	onEdit,
}: AnswerEditorProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const answerText = question.answerTexts[answerIndex];
	const explanation = question.explanations
		? question.explanations[answerIndex]
		: '';

	function editAnswerText(newAnswerText: string) {
		const newAnswerTexts = question.answerTexts.map(
			(answer: string, i: number) =>
				i === answerIndex ? newAnswerText : answer
		);
		onEdit({ answerTexts: newAnswerTexts,
		});
	}

	function editExplanation(newExplanation: string) {
		if (question.explanations) {
			const newExplanations = question.explanations.map((explanation, i) =>
				i === answerIndex ? newExplanation : explanation
			);
			onEdit({ explanations: newExplanations,
			});
		}
	}

	function toggleIsCorrect() {
		let newCorrectAnswers;

		if (question.correctAnswers.includes(answerIndex)) {
			newCorrectAnswers = question.correctAnswers.filter(
				(indexValue: number) => indexValue !== answerIndex
			);
		} else {
			newCorrectAnswers = [...question.correctAnswers, answerIndex];
		}

		onEdit({ correctAnswers: newCorrectAnswers,
		});
	}

	return (
		<div className="w-full h-fit bg-gray-100 bg-opacity-50 flex flex-col font-extrabold text-white text-base rounded-xl my-2 lg:text-lg 2xl:text-xl">
			<div
				className={
					'w-full h-12 flex flex-row items-center justify-between text-black rounded-xl px-4 shadow-heavy 2xl:h-14 ' +
					color
				}
			>
				{/* Expand/collapse and editable answer text */}
				<div className="w-3/4 flex flex-row items-center">
					<div
						className="relative w-4 h-4 mr-4 cursor-pointer 2xl:w-5 2xl:h-5"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded && (
							<Image
								alt="editor collapse"
								src={editor_minus}
								fill
								sizes="5vw"
							/>
						)}
						{!isExpanded && (
							<Image alt="editor expand" src={editor_plus} fill sizes="5vw" />
						)}
					</div>

					<input
						className="grow bg-transparent border border-white px-1 placeholder:text-black placeholder:opacity-50"
						type="text"
						placeholder="Answer"
						maxLength={100}
						value={answerText}
						onChange={(e) => editAnswerText(e.target.value)}
					/>
				</div>

				{/* Checkbox input to toggle correct/incorrect */}
				<div>
					<span className="px-2">Correct?</span>
					<input
						className="cursor-pointer"
						type="checkbox"
						checked={question.correctAnswers.includes(answerIndex)}
						onChange={() => toggleIsCorrect()}
					/>
				</div>
			</div>

			{/* Show detailed editor view for expanded answer */}
			{isExpanded && (
				<div className="w-full flex flex-col items-center justify-center p-4">
					<div className="w-full bg-white flex items-center justify-center mb-2 p-2 2xl:p-3">
						<textarea
							className="w-full p-2 border border-black text-black"
							name="explanation"
							placeholder="Add an explanation for your answer"
							maxLength={100}
							value={explanation}
							onChange={(e) => editExplanation(e.target.value)}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
