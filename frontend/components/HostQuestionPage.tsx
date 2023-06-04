import QuestionTop from '@/components/QuestionPages/QuestionTop';
import QuestionAnswers from '@/components/QuestionPages/QuestionAnswers';
import { Question, currentPlayersState } from '@/lib/useKakawGame';
import HostQuestionBottom from './QuestionPages/HostQuestionBottom';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { apiCall } from '@/lib/api';

export interface HostQuestionPageProps {
	question: Question;
	index: number;
	postQuestion: boolean;
}

export default function HostQuestionPage(props: HostQuestionPageProps) {
	const currentPlayers = useRecoilValue(currentPlayersState);

	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	return (
		<main className="bg-purple-100 flex flex-col h-screen items-center">
			<Head>
				<title>Game - Kakaw!</title>
			</Head>
			<QuestionTop
				qNum={props.index + 1}
				qText={props.question.questionText}
				endTime={props.question.endTime}
			></QuestionTop>
			<QuestionAnswers
				answers={props.question.answerTexts}
				correctAnswers={props.question.correctAnswers}
				explanations={props.question.explanations}
			></QuestionAnswers>
			<HostQuestionBottom
				numAnswered={currentPlayers.size}
				numPlayers={
					// TODO get from backend
					5
				}
				onEndQuestion={async () => {
					try {
						await apiCall(
							'POST',
							props.postQuestion
								? `/games/${gameId}/questions/${props.index + 1}/start`
								: `/games/${gameId}/questions/${props.index}/end`,
							null,
							{ gameId: gameId, id: playerId }
						);
					} catch (e) {
						alert(
							`${
								props.postQuestion ? 'Going to next' : 'Ending'
							} question failed. Please try again.`
						);
						console.error(e);
					}
				}}
				buttonText={props.postQuestion ? 'Next Question' : 'End Guessing'}
			/>
		</main>
	);
}
