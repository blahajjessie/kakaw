import Link from 'next/link';
import { useState } from 'react';

import EditorGuide from '@/components/EditorPages/EditorTutorial';
import TimerSetter from '@/components/EditorPages/TimerSetter';
import QuestionEditor from '@/components/EditorPages/QuestionEditor';

import { Quiz, QuizMeta, QuizQuestion } from '../../backend/src/quiz';

export default function EditorNewPage() {
	const [page, setPage] = useState(0);
	const [timerValue, setTimerValue] = useState(15);

	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [quizMeta, setQuizMeta] = useState<QuizMeta | null>(null);
	const [questions, setQuestions] = useState<QuizQuestion[]>([]);

	const initialQuizMeta = {
		title: '',
		author: '',
		pointDefault: 1000,
		timeDefault: 15,
	};

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

	function validateInitialQuiz() {
		setPage(1);
	}

	if (page === 0) {
		return (
			<main className="bg-purple-100 h-screen flex flex-col items-center justify-center text-black font-extrabold">
				<div className="w-5/6 h-full flex flex-col items-center justify-center">
					<div className="w-fit bg-gray-100 border border-black px-6 py-1 -mb-6 text-lg z-20 xl:text-2xl 2xl:px-8 2xl:py-2 2xl:text-3xl">
						Create your own Quiz!
					</div>

					<div className="w-full h-4/5 bg-purple-500 flex flex-col items-center justify-center p-6 text-base rounded-3xl z-10 xl:text-xl 2xl:text-2xl">
						<EditorGuide
							tutorialText={`On this page you can pick a name for your quiz and set a default timer
						(You can change the timer for each individual question later)`}
						/>

						<Link
							href="/upload"
							className="self-start bg-purple-50 px-12 py-1 mb-1 rounded-lg text-white text-center shadow-heavy text-base hover:brightness-110 2xl:px-16 2xl:mb-2 2xl:text-lg"
						>
							Back
						</Link>

						<div className="w-full h-full flex flex-col items-center justify-around bg-gray-100 bg-opacity-50 rounded-xl my-2 shadow-heavy">
							<div className="w-2/3 flex flex-col items-center justify-center">
								<div className="w-3/5 bg-white bg-opacity-50 px-4 py-1 rounded-lg text-center mb-2 lg:py-2 lg:mb-3 2xl:py-4 2xl:mb-6">
									Choose a name for your Quiz
								</div>
								<div className="w-2/3 bg-white rounded-lg p-2 shadow-heavy 2xl:p-3">
									<input
										type="text"
										placeholder="Quiz name"
										className="w-full border border-black text-center p-1 lg:p-2 2xl:p-3"
									></input>
								</div>
							</div>
							<div className="w-2/5 bg-white bg-opacity-50 flex justify-between px-4 py-1 rounded-lg text-center lg:py-2 2xl:py-4">
								<div className="pl-4">Set default timer:</div>
								<TimerSetter
									initTimerValue={timerValue}
									onChange={(v) => setTimerValue(v)}
								/>
							</div>
						</div>

						<button
							className="bg-orange-200 hover:brightness-110 border-1 border-gray-200 rounded-lg px-4 py-1 mt-1 text-white text-center shadow-heavy 2xl:mt-2"
							onClick={validateInitialQuiz}
						>
							Add Questions
						</button>
					</div>
				</div>
			</main>
		);
	} else {
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

						<button
							className="self-start bg-purple-50 px-12 py-1 mb-1 rounded-lg text-white text-center shadow-heavy text-base hover:brightness-110 2xl:px-16 2xl:mb-2 2xl:text-lg"
							onClick={() => setPage(0)}
						>
							Back
						</button>

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
}
