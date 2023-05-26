import QuestionTop from '@/components/QuestionPages/QuestionTop';
import QuestionAnswers from '@/components/QuestionPages/QuestionAnswers';
import { Question, currentPlayersState } from '@/lib/useKakawGame';
import HostQuestionBottom from './QuestionPages/HostQuestionBottom';
import { useRecoilValue } from 'recoil';
import { RequestState, useRequest } from '@/lib/api';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export interface HostQuestionPageProps {
	question: Question;
	index: number;
}

export default function HostQuestionPage(props: HostQuestionPageProps) {
	const currentPlayers = useRecoilValue(currentPlayersState);

	const router = useRouter();
	const { gameId } = router.query as { gameId: string };

	const { state, response, error, trigger } = useRequest(
		'POST',
		`/games/${gameId}/questions/${props.index}/end`
	);

	useEffect(() => {
		if (state == RequestState.Errored) {
			alert(`Ending question failed: ${JSON.stringify(error)}`);
		}
	}, [state, error]);

	return (
		<main className="bg-purple-100 flex flex-col h-screen items-center">
			<QuestionTop
				qNum={props.index + 1}
				qText={props.question.questionText}
				endTime={props.question.endTime}
			></QuestionTop>
			<QuestionAnswers answers={props.question.answerTexts}></QuestionAnswers>
			<HostQuestionBottom
				numAnswered={currentPlayers.size}
				numPlayers={
					// TODO get from backend
					5
				}
				onEndQuestion={trigger}
			/>
		</main>
	);
}
