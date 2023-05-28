import { useState } from 'react';

import EditorGuide from '@/components/EditorPages/EditorTutorial';
import TimerSetter from '@/components/EditorPages/TimerSetter';
import QuestionEditor from '@/components/EditorPages/QuestionEditor';

import { QuizMeta, QuizQuestion } from '@/../backend/src/quiz';
import { Quiz } from '@/../backend/dist/quiz';

export default function EditorPage() {
	// Title editor page (0) or questions editor page (1)
	const [page, setPage] = useState(0);

	// Quiz information
	const [meta, setMeta] = useState<QuizMeta>({
		title: '',
		author: 'Host',
		pointDefault: 1000,
		timeDefault: 15,
	});
	const [questions, setQuestions] = useState<QuizQuestion[]>([]);

	// Editor tutorial state -- see toggleTutorialState()
	const [tutorialState, setTutorialState] = useState('tap');

	// Return questions with removed explanations property
	// for the questions that don't use it
	function filterExplanations(
		currentQuestions: QuizQuestion[]
	): QuizQuestion[] {
		let newQuestions = currentQuestions.map((question) => {
			if (question.explanations?.every((explanation) => explanation === '')) {
				return {
					...question,
					explanations: undefined,
				};
			}
			return question;
		});
		return newQuestions;
	}

	// -------- tutorial states --------
	// tap: default instruction state
	// title: help blurb for editor title page
	// questions: help blurb for editor questions page
	// leave: warning when user clicks back button to navigate away
	// check: warning when user tries to start, but quiz is invalid
	function toggleTutorialState(newTutorialState?: string) {
		if (newTutorialState) {
			setTutorialState(newTutorialState);
			return;
		}

		if (tutorialState === 'tap') {
			if (page === 0) {
				setTutorialState('title');
			} else {
				setTutorialState('questions');
			}
		} else {
			setTutorialState('tap');
		}
	}

	// Check that quiz metadata and questions are all valid
	// using Quiz constructor's validation
	function isValidQuiz(meta: QuizMeta, questions: QuizQuestion[]) {
		try {
			const newQuiz = new Quiz({
				meta,
				questions,
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	function downloadQuiz() {
		const filteredQuestions = filterExplanations(questions);
		if (!isValidQuiz(meta, filteredQuestions)) {
			toggleTutorialState('check');
			return;
		}

		const quizFile = new Blob([JSON.stringify({ meta, filteredQuestions })], {
			type: 'application/json',
		});

		const temp = document.createElement('a');
		temp.href = URL.createObjectURL(quizFile);
		temp.download = meta.title + '.json';
		document.body.appendChild(temp);
		temp.click();
	}

	function startQuiz() {
		const filteredQuestions = filterExplanations(questions);
		if (!isValidQuiz(meta, filteredQuestions)) {
			toggleTutorialState('check');
			return;
		}

		// Use meta and filteredQuestions to construct and run quiz
	}

	return (
		<main className="bg-purple-100 h-screen flex flex-col items-center justify-center text-black font-extrabold">
			<div className="w-5/6 h-full flex flex-col items-center justify-center">
				<EditorGuide
					state={tutorialState}
					toggleState={() => toggleTutorialState()}
				/>

				{/* Title and default timer editor view */}
				{page === 0 && (
					<>
						<div className="w-fit bg-gray-100 border border-black px-6 py-1 -mb-6 text-lg z-20 lg:text-2xl 2xl:px-8 2xl:py-2 2xl:text-3xl">
							Create your own Quiz!
						</div>

						<div className="w-full h-4/5 bg-purple-500 flex flex-col items-center justify-center p-6 text-base rounded-3xl z-10 lg:text-lg 2xl:text-2xl">
							{/* Back button, will check that user is ok with losing progress */}
							<button
								className="self-start bg-purple-50 px-12 py-1 mb-1 rounded-lg text-white text-center shadow-heavy text-base hover:brightness-110 2xl:px-16 2xl:mb-2 2xl:text-lg"
								onClick={() => toggleTutorialState('leave')}
							>
								Back
							</button>

							{/* Title and default timer inputs */}
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
											maxLength={100}
											value={meta.title}
											onChange={(e) =>
												setMeta({
													...meta,
													title: e.target.value,
												})
											}
										></input>
									</div>
								</div>

								<div className="w-2/5 bg-white bg-opacity-50 flex justify-between px-4 py-1 rounded-lg text-center lg:py-2 2xl:py-4">
									<div className="pl-4">Set default timer:</div>
									<TimerSetter
										initTimerValue={meta.timeDefault}
										onChange={(v) =>
											setMeta({
												...meta,
												timeDefault: v,
											})
										}
									/>
								</div>
							</div>

							{/* Add Questions button, changes view to questions editor */}
							<button
								className="bg-orange-200 hover:brightness-110 disabled:cursor-not-allowed border-1 border-gray-200 rounded-lg px-4 py-1 mt-1 text-white text-center shadow-heavy 2xl:mt-2"
								onClick={() => {
									setPage(1);
									toggleTutorialState('tap');
								}}
								disabled={meta.title.length === 0}
							>
								Add Questions
							</button>
						</div>
					</>
				)}

				{/* Questions and answers editor view */}
				{page === 1 && (
					<>
						<div className="w-fit bg-gray-100 border border-black px-6 py-1 -mb-6 text-lg z-20 xl:text-2xl 2xl:px-8 2xl:py-2 2xl:text-3xl">
							Your Questions
						</div>

						<div className="w-full h-5/6 bg-purple-500 flex flex-col items-center justify-center p-6 text-base rounded-3xl z-10 lg:text-lg 2xl:text-2xl">
							{/* Back button, navigates back to title and default timer editor view */}
							<button
								className="self-start bg-purple-50 px-12 py-1 mb-1 rounded-lg text-white text-center shadow-heavy text-base hover:brightness-110 2xl:px-16 2xl:mb-2 2xl:text-lg"
								onClick={() => {
									setPage(0);
									toggleTutorialState('tap');
								}}
							>
								Back
							</button>

							{/* Expandable questions and Add Question button */}
							<div className="w-full h-full flex flex-col items-center bg-gray-100 bg-opacity-50 rounded-xl py-4 my-2 shadow-heavy overflow-y-scroll">
								{questions.map((question, i) => (
									<QuestionEditor
										question={question}
										questionNumber={i + 1}
										onEdit={(newQuestion) =>
											setQuestions(
												questions.map((question, index) =>
													i === index ? newQuestion : question
												)
											)
										}
										key={i}
									/>
								))}

								<button
									className="w-4/5 h-12 bg-gray-100 bg-opacity-75 shrink-0 flex items-center justify-center text-center text-white rounded-xl my-2 shadow-heavy cursor-pointer hover:brightness-110 2xl:h-14"
									onClick={() =>
										setQuestions([
											...questions,
											{
												questionText: '',
												answerTexts: [],
												correctAnswers: [],
												explanations: [],
												time: meta.timeDefault,
											},
										])
									}
								>
									Add Question
								</button>
							</div>

							{/* Download and Start buttons */}
							<div className="w-full flex justify-between text-white 2xl:mt-2">
								<button
									className="w-2/5 bg-purple-50 hover:brightness-110 border-1 border-gray-200 rounded-lg px-4 py-1 mt-1 text-center shadow-heavy"
									type="button"
									onClick={downloadQuiz}
								>
									Download Quiz
								</button>

								<button
									className="w-2/5 bg-orange-200 hover:brightness-110 border-1 border-gray-200 rounded-lg px-4 py-1 mt-1 text-center shadow-heavy"
									type="button"
									onClick={startQuiz}
								>
									Start Quiz
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</main>
	);
}
