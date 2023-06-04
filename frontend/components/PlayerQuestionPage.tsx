import { useState } from 'react';
import Image from 'next/image';
import QuestionTop from '@/components/QuestionPages/QuestionTop';
import QuestionAnswers from '@/components/QuestionPages/QuestionAnswers';
import PlayerQuestionBottom from '@/components/QuestionPages/PlayerQuestionBottom';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import Head from 'next/head';

import GoodJob from 'public/goodjob.png';
import NoLuck from 'public/noluck.png';
import { Question, usernameState, scoreState } from '@/lib/useKakawGame';
import { apiCall } from '@/lib/api';

export interface PlayerQuestionPageProps {
	question: Question;
	index: number;
	startWithModal?: boolean;
	showContinue?: boolean;
	playerAnswer?: number;
	scoreChange?: number;
}

export default function PlayerQuestionPage({
	question,
	index,
	startWithModal = false,
	showContinue = false,
	playerAnswer,
	scoreChange,
}: PlayerQuestionPageProps) {
	// which answer was actually given -- starts as null if the player hasn't answered yet; is
	// always defined on the post-question page
	const [finalAnswer, setFinalAnswer] = useState(playerAnswer);

	// State variables
	const [showModal, setShowModal] = useState(startWithModal); // Modal visibility state

	const username = useRecoilValue(usernameState);
	const score = useRecoilValue(scoreState);

	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	// Toggle modal visibility
	const toggleModal = () => {
		setShowModal(!showModal);
	};

	// Handle answer click event
	const handleAnswerClick = async (answerIndex: number) => {
		// Update the firstClickedAnswer state if it is currently null
		if (finalAnswer === undefined) {
			try {
				await apiCall(
					'POST',
					`/games/${gameId}/questions/${index}/answer`,
					{
						userId: playerId,
						answer: answerIndex,
					},
					{ gameId: gameId, id: playerId }
				);
				setFinalAnswer(answerIndex);
			} catch (e) {
				alert('Error answering question, please try again');
				console.error(e);
			}
		}
	};

	const feedbackImage =
		question.correctAnswers !== undefined &&
		playerAnswer !== undefined &&
		question.correctAnswers.includes(playerAnswer)
			? GoodJob
			: NoLuck;

	return (
		<main className="bg-purple-100 flex flex-col h-screen items-center">
			<Head>
				<title>Game - Kakaw!</title>
			</Head>
			{/* Render the question header */}
			<QuestionTop
				qNum={index + 1}
				qText={question.questionText}
				endTime={question.endTime}
				showContinue={showContinue}
			></QuestionTop>
			{/* Render the question answers */}
			<QuestionAnswers
				answers={question.answerTexts}
				playerAnswer={finalAnswer}
				onAnswerClick={handleAnswerClick}
				explanations={question.explanations}
				correctAnswers={question.correctAnswers}
			/>
			{/* Render the player question bottom */}
			<PlayerQuestionBottom
				name={username}
				score={score}
				scoreChange={scoreChange}
			/>
			{/* Render the modal when showModal is true */}
			{showModal && (
				<div
					className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50"
					onClick={toggleModal}
				>
					{/* Render the selected image if selectedAnswer is not null */}
					{finalAnswer !== null && (
						<div className="w-11/12 h-full flex flex-col items-center justify-center">
							<Image
								alt="Popup Image"
								src={feedbackImage}
								width={400}
								className="-mb-6"
							/>
						</div>
					)}

					{/* Close button */}
					<button className="absolute top-4 right-4 text-white text-xl">
						Close
					</button>
				</div>
			)}
		</main>
	);
}

export interface PlayerPostQuestionPageProps {
	question: Question;
	index: number;
	playerAnswer: number;
	scoreChange: number;
}

// this component is separate so that react replaces the PlayerQuestionPage instead of only
// re-rendering it
export function PlayerPostQuestionPage(props: PlayerPostQuestionPageProps) {
	return (
		<PlayerQuestionPage {...props} startWithModal={true} showContinue={true} />
	);
}
