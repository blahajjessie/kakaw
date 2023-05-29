import { useState } from 'react';
import Image from 'next/image';
import QuestionTop from '@/components/QuestionPages/QuestionTop';
import QuestionAnswers from '@/components/QuestionPages/QuestionAnswers';
import PlayerQuestionBottom from '@/components/QuestionPages/PlayerQuestionBottom';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

import GoodJob from 'public/goodjob.png';
import NoLuck from 'public/noluck.png';
import { Question, usernameState, scoreState } from '@/lib/useKakawGame';
import { apiCall } from '@/lib/api';

export interface PlayerQuestionPageProps {
	question: Question;
	index: number;
}

export default function PlayerQuestionPage({
	question,
	index,
}: PlayerQuestionPageProps) {
	// State variables
	const [showModal, setShowModal] = useState(false); // Modal visibility state
	const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(
		undefined
	); // Selected answer state
	const [selectedImage, setSelectedImage] = useState(GoodJob); // Default image is GoodJob
	const [firstClickedAnswer, setFirstClickedAnswer] = useState<
		number | undefined
	>(undefined); // First clicked answer state

	const username = useRecoilValue(usernameState);
	const score = useRecoilValue(scoreState);

	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	// TODO SEND THIS
	() =>
		apiCall('POST', `/games/${gameId}/questions/${index}/answers`, {
			userId: playerId,
			answer: firstClickedAnswer,
		});

	// Toggle modal visibility
	const toggleModal = () => {
		setShowModal(!showModal);
	};

	// Handle answer click event
	const handleAnswerClick = (answerIndex: number) => {
		setSelectedAnswer(answerIndex);

		// Determine the selected image path based on your conditions
		const imagePath = determineSelectedImagePath(answerIndex);
		setSelectedImage(imagePath);

		// Update the firstClickedAnswer state if it is currently null
		if (firstClickedAnswer === null) {
			setFirstClickedAnswer(answerIndex);
			toggleModal();
		}
	};

	// Function to determine the selected image path based on conditions
	const determineSelectedImagePath = (answerIndex: number) => {
		// TODO this has to get correct answer from server
		throw 'unimplemented';
		// Add your conditions here to choose between GoodJob and NoLuck images
		// For example:
		if (answerIndex === 0) {
			return NoLuck; // Select NoLuck image
		} else {
			return GoodJob; // Select GoodJob image
		}
	};

	return (
		<main className="bg-purple-100 flex flex-col h-screen items-center">
			{/* Render the question header */}
			<QuestionTop
				qNum={index + 1}
				qText={question.questionText}
				endTime={question.endTime}
			></QuestionTop>

			{/* Render the question answers */}
			<QuestionAnswers
				answers={question.answerTexts}
				selectedAnswerIndex={selectedAnswer}
				onAnswerClick={() => console.log('answer click')}
				// TODO explanations?
			></QuestionAnswers>

			{/* Render the player question bottom */}
			<PlayerQuestionBottom
				name={username}
				score={score}
			></PlayerQuestionBottom>

			{/* Render the modal when showModal is true */}
			{showModal && (
				<div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
					{/* Render the selected image if selectedAnswer is not null */}
					{selectedAnswer !== null && (
						<div className="w-11/12 h-full flex flex-col items-center justify-center">
							<Image
								alt="Popup Image"
								src={selectedImage}
								width={400}
								className="-mb-6"
							/>
						</div>
					)}

					{/* Close button */}
					<button
						className="absolute top-4 right-4 text-white text-xl"
						onClick={toggleModal}
					>
						Close
					</button>
				</div>
			)}
		</main>
	);
}
