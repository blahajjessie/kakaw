import Image from 'next/image';
import { useState } from 'react';

import TimerSetter from '@/components/EditorPages/TimerSetter';
import AnswerEditor from '@/components/EditorPages/AnswerEditor';

import { QuizQuestion } from '../../../backend/src/gameTypes';

import editor_plus from '@/public/editor_plus.svg';
import editor_minus from '@/public/editor_minus.svg';

interface QuestionEditorProps {
	question: QuizQuestion;
	questionNumber: number;
	onEdit: (question: QuizQuestion) => void;
}

// {
// 	questionText,
// 	answerTexts,
// 	correctAnswers,
//  answerExplanations, (later)
// 	time,
// 	points,
// }

const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200'];

export default function QuestionEditor({
	question,
	questionNumber,
	onEdit,
}: QuestionEditorProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	function editQuestion(updates: Partial<QuizQuestion>) {
		onEdit({
			...question,
			...updates,
		});
	}

	return (
		<div className="w-4/5 h-fit bg-gray-100 bg-opacity-50 flex flex-col font-extrabold text-white text-base rounded-xl my-2 lg:text-lg 2xl:text-xl">
			<div className="w-full h-12 bg-gray-100 bg-opacity-50 flex flex-row items-center justify-between rounded-xl px-4 shadow-heavy 2xl:h-14">
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
					<span>Question {questionNumber}</span>
				</div>

				<div className="w-40 bg-gray-100 flex items-center justify-between border border-gray-200 rounded-xl px-2 py-0.5 lg:w-44 2xl:w-52">
					<span>Timer:</span>
					<TimerSetter
						initTimerValue={question.time || 15}
						onChange={(v) => editQuestion({ time: v })}
					/>
				</div>
			</div>

			{/* Show detailed editor view for expanded question */}
			{isExpanded && (
				<div className="w-full flex flex-col items-center justify-center p-4">
					<div className="w-full bg-white flex items-center justify-center mb-2 p-2 2xl:p-3">
						<textarea
							className="w-full p-2 border border-black text-black"
							name="questionText"
							placeholder="Add your question body here"
							value={question.questionText}
							onChange={(e) => editQuestion({ questionText: e.target.value })}
						/>
					</div>

					{question.answerTexts.map((_, i) => (
						<AnswerEditor
							question={question}
							answerIndex={i}
							color={colors[i]}
							onEdit={(answer) => editQuestion(answer)}
							key={i}
						/>
					))}

					{/* Show "Add Answer" button only if there are available colors */}
					{question.answerTexts.length < colors.length && (
						<button
							className={
								'w-full h-12 flex items-center justify-center text-center text-black rounded-xl my-2 shadow-heavy cursor-pointer hover:brightness-110 2xl:h-14 ' +
								colors[question.answerTexts.length]
							}
							onClick={() =>
								editQuestion({
									answerTexts: [...question.answerTexts, ''],
									// answerExplanations: [...question.answerExplanations, ''],
								})
							}
						>
							Add Answer
						</button>
					)}
				</div>
			)}
		</div>
	);
}
