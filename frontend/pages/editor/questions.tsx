import Link from 'next/link';
import { useState } from 'react';

import EditorGuide from '@/components/EditorPages/EditorTutorial';
import QuestionEditor from '@/components/EditorPages/QuestionEditor';

import { QuizQuestion } from '../../../backend/src/gameTypes';

export default function EditorQuestionsPage() {
	const [questions, setQuestions] = useState<QuizQuestion[]>([]);

	function addQuestion() {
		setQuestions([
			...questions,
			{
				questionText: '',
				answerTexts: [],
				correctAnswers: [],
				// answerExplain: [],
				time: 15,
				points: 1000,
			},
		]);
	}

	function editQuestions(newQuestion: QuizQuestion, index: number) {
		const newQuestions = questions.map((question, i) =>
			i === index ? newQuestion : question
		);
		setQuestions(newQuestions);
	}

	return (
		<main className="bg-purple-100 h-screen flex flex-col items-center justify-center text-black font-extrabold">
			<div className="w-5/6 h-full flex flex-col items-center justify-center">
				<div className="w-fit bg-gray-100 border border-black px-6 py-1 -mb-6 text-lg z-20 xl:text-2xl 2xl:px-8 2xl:py-2 2xl:text-3xl">
					Your Questions
				</div>

				<div className="w-full h-5/6 bg-purple-500 flex flex-col items-center justify-center p-6 text-base rounded-3xl z-10 xl:text-xl 2xl:text-2xl">
					<EditorGuide
						tutorialText={`You can change the timer for each individual question and add up to 6 answers for each. Your Answer explanation will appear during the game.`}
					/>

					<Link
						href="/editor/new"
						className="self-start bg-purple-50 px-12 py-1 mb-1 rounded-lg text-white text-center shadow-heavy text-base hover:brightness-110 2xl:px-16 2xl:mb-2 2xl:text-lg"
					>
						Back
					</Link>

					<div className="w-full h-full flex flex-col items-center bg-gray-100 bg-opacity-50 rounded-xl py-4 my-2 shadow-heavy overflow-y-scroll">
						{questions.map((question, i) => (
							<QuestionEditor
								question={question}
								questionNumber={i + 1}
								onEdit={(newQuestion) => editQuestions(newQuestion, i)}
								key={i}
							/>
						))}

						<button
							className="w-4/5 h-12 bg-gray-100 bg-opacity-75 shrink-0 flex items-center justify-center text-center text-white rounded-xl my-2 shadow-heavy cursor-pointer hover:brightness-110 2xl:h-14"
							onClick={addQuestion}
						>
							Add Question
						</button>
					</div>

					<div className="w-full flex justify-between 2xl:mt-2">
						<button
							className="w-2/5 bg-purple-50 hover:brightness-110 border-1 border-gray-200 rounded-lg px-4 py-1 mt-1 text-white text-center shadow-heavy"
							type="button"
						>
							Download Quiz
						</button>

						<button
							className="w-2/5 bg-orange-200 hover:brightness-110 border-1 border-gray-200 rounded-lg px-4 py-1 mt-1 text-white text-center shadow-heavy"
							type="button"
						>
							Start Quiz
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
