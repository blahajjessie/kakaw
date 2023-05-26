import Image from 'next/image';
import { useState } from 'react';

import { QuizQuestion } from '@/../backend/src/quiz';

import editor_plus from '@/public/editor_plus.svg';
import editor_minus from '@/public/editor_minus.svg';

interface AnswerEditorProps {
	question: QuizQuestion;
	answerIndex: number;
	color: string;
	onEdit: (question: QuizQuestion) => void;
}

export default function AnswerEditor({
	question,
	answerIndex,
	color,
	onEdit,
}: AnswerEditorProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const answerText = question.answerTexts[answerIndex];
	// const answerExplanation = question.answerExplanations[answerIndex];
	const isCorrect = answerIndex in question.correctAnswers;

	function editAnswerText(newAnswerText: string) {
		const newAnswerTexts = question.answerTexts.map(
			(answer: string, i: number) =>
				i === answerIndex ? newAnswerText : answer
		);
		onEdit({
			...question,
			answerTexts: newAnswerTexts,
		});
	}

	// function editAnswerExplanation(newAnswerExplanation: string) {
	// 	const newAnswerExplanations = question.answerTexts.map((answerExplanation, i) =>
	// 		i === answerIndex ? newAnswerExplanation : answerExplanation
	// 	);
	// 	onEdit({
	// 		...question,
	// 		answerExplanations: newAnswerExplanations,
	// 	});
	// }

	function toggleIsCorrect() {
		let newCorrectAnswers;

		if (isCorrect) {
			newCorrectAnswers = question.correctAnswers.filter(
				(indexValue: number) => indexValue !== answerIndex
			);
		} else {
			newCorrectAnswers = [...question.correctAnswers, answerIndex];
		}

		onEdit({
			...question,
			correctAnswers: newCorrectAnswers,
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
				<div className="flex flex-row items-center">
					<div
						className="relative w-4 h-4 mr-4 cursor-pointer 2xl:w-5 2xl:h-5"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded && (
							<Image alt="editor collapse" src={editor_minus} fill />
						)}
						{!isExpanded && (
							<Image alt="editor expand" src={editor_plus} fill />
						)}
					</div>

					<input
						className="bg-transparent border border-white px-1 placeholder:text-black placeholder:opacity-50"
						type="text"
						placeholder="Answer"
						value={answerText}
						onChange={(e) => editAnswerText(e.target.value)}
					/>
				</div>

				<div>
					<span className="px-2">Correct?</span>
					<input
						className="cursor-pointer"
						type="checkbox"
						checked={isCorrect}
						onChange={() => toggleIsCorrect()}
					/>
				</div>
			</div>
		</div>
	);
}
