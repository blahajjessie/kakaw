import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import NoMobileSupport from '@/components/Fixtures/NoMobileSupport';
import MatchMediaWrapper from '@/components/MatchMediaWrapper';
import EditorGuide from '@/components/EditorPages/EditorTutorial';
import TimerSetter from '@/components/Fixtures/TimerSetter';
import QuestionEditor from '@/components/EditorPages/QuestionEditor';
import { apiCall } from '@/lib/api';

import { QuizMeta, QuizQuestion } from '@/lib/editorQuiz';

export default function EditorPage() {
	const [page, setPage] = useState(0);
	const [meta, setMeta] = useState<QuizMeta>({
		title: '',
		author: 'Host',
		pointDefault: 1000,
		timeDefault: 15,
	});
	const [questions, setQuestions] = useState<QuizQuestion[]>([]);
	const [tutorialState, setTutorialState] = useState('tap');
	const [isStarting, setIsStarting] = useState(false);
	const router = useRouter();

	// Return questions with removed explanations property
	// for the questions that don't use it
	function filterExplanations(
		currentQuestions: QuizQuestion[]
	): QuizQuestion[] {
		return currentQuestions.map((question) => {
			if (question.explanations?.every((explanation) => explanation === '')) {
				return {
					...question,
					explanations: undefined,
				};
			}
			return question;
		});
	}

	// -------- tutorial states --------
	// tap: default instruction state
	// title: help blurb for editor title page
	// questions: help blurb for editor questions page
	// leave: warning when user clicks back button to navigate away
	// check: warning when user tries to start, but quiz is invalid
	function toggleTutorialState(newTutorialState?: string) {
		let newState;
		if (newTutorialState) {
			newState = newTutorialState;
		} else if (tutorialState === 'tap') {
			if (page === 0) {
				newState = 'title';
			} else {
				newState = 'questions';
			}
		} else {
			newState = 'tap';
		}
		setTutorialState(newState);
	}

	function downloadQuiz() {
		const quizFile = new Blob(
			[
				JSON.stringify({
					meta: meta,
					questions: filterExplanations(questions),
				}),
			],
			{
				type: 'application/json',
			}
		);
		const temp = document.createElement('a');
		temp.href = URL.createObjectURL(quizFile);
		temp.download = meta.title + '.json';
		document.body.appendChild(temp);
		temp.click();
	}

	async function startQuiz() {
		setIsStarting(true);
		try {
			// this will have to store the host ID somewhere so that the websocket opening code can use it
			const { gameId, hostId, token } = await apiCall('POST', '/games', {
				meta: meta,
				questions: filterExplanations(questions),
			});
			sessionStorage.setItem('kakawToken', token);
			router.push(`/host/${gameId}/${hostId}`);
		} catch (e) {
			console.error(e);
			toggleTutorialState('check');
		}
		setIsStarting(false);
	}

	const editDefaultTime = useCallback(
		(v: number) => setMeta((meta) => ({ ...meta, timeDefault: v })),
		[]
	);

	const editQuestion = useCallback(
		(updates: Partial<QuizQuestion>, indexToEdit: number) => {
			setQuestions((questions) =>
				questions.map((question, i) =>
					i === indexToEdit ? { ...question, ...updates } : question
				)
			);
		},
		[]
	);

	const mobileContent = <NoMobileSupport />;

	const desktopContent = (
		<main className="bg-purple-100 h-screen flex flex-col items-center justify-center text-black font-extrabold">
			<Head>
				<title>Quiz Editor - Kakaw!</title>
			</Head>
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
										onChange={editDefaultTime}
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
										questionIndex={i}
										onEdit={editQuestion}
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
												points: meta.pointDefault,
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
									{isStarting ? 'Starting...' : 'Start Quiz'}
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</main>
	);

	return (
		<MatchMediaWrapper
			mobileContent={mobileContent}
			desktopContent={desktopContent}
		/>
	);
}
