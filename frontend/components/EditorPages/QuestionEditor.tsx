import Image from 'next/image';
import { useState, useEffect } from 'react';

import TimerSetter from '@/components/EditorPages/TimerSetter';
import AnswerEditor from '@/components/EditorPages/AnswerEditor';

import editor_plus from '@/public/editor_plus.svg';
import editor_minus from '@/public/editor_minus.svg';

import { QuizQuestion } from '../../../backend/src/gameTypes';

interface QuestionEditorProps {
	question: QuizQuestion;
	number: number;
	onEdit: (question: QuizQuestion) => void;
}

// {
// 	questionText,
// 	answerTexts,
// 	correctAnswers,
// 	time,
// 	points,
// }

export default function QuestionEditor({
	question,
	number,
	onEdit,
}: QuestionEditorProps) {
	const [timerValue, setTimerValue] = useState(15);
	const [isExpanded, setIsExpanded] = useState(false);

	function addAnswer() {
		onEdit({
			...question,
			answerTexts: [...question.answerTexts, 'test'],
		});
	}

	return (
		<div className="w-4/5 h-fit bg-gray-100 bg-opacity-50 flex flex-col font-extrabold text-white text-base rounded-lg my-2 lg:text-lg 2xl:text-xl">
			<div className="w-full h-12 bg-gray-100 bg-opacity-50 flex flex-row items-center justify-between rounded-lg px-4 shadow-heavy 2xl:h-14">
				<div
					className="flex flex-row items-center cursor-pointer"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					<div className="relative w-4 h-4 mr-4 2xl:w-5 2xl:h-5">
						{isExpanded && (
							<Image alt="editor collapse" src={editor_minus} fill />
						)}
						{!isExpanded && (
							<Image alt="editor expand" src={editor_plus} fill />
						)}
					</div>
					<span>Question {number}</span>
				</div>

				<div className="w-40 bg-gray-100 flex items-center justify-between border border-gray-200 rounded-xl px-2 py-0.5 lg:w-44 2xl:w-52">
					<span>Timer:</span>
					<TimerSetter
						initTimerValue={timerValue}
						onChange={(v) => setTimerValue(v)}
					/>
				</div>
			</div>

			{isExpanded && (
				<div className="w-full flex flex-col items-center justify-center p-4">
					{question.answerTexts.map((answer, i) => (
						<AnswerEditor
							answer={answer}
							isCorrect={i in question.correctAnswers}
							key={i}
						/>
					))}
					<div
						className="w-full h-12 bg-gray-100 bg-opacity-75 flex items-center justify-center text-center text-white rounded-lg my-2 shadow-heavy cursor-pointer hover:brightness-110 2xl:h-14"
						onClick={addAnswer}
					>
						Add Answer
					</div>
				</div>
			)}
		</div>
	);
}
