import QuestionTop from '@/components/QuestionPages/QuestionTop';
import QuestionAnswers from '@/components/QuestionPages/QuestionAnswers';
import PlayerQuestionBottom from '@/components/QuestionPages/PlayerQuestionBottom';
import { Question } from '@/lib/useKakawGame';
import HostQuestionBottom from './QuestionPages/HostQuestionBottom';

export interface QuestionPageProps {
	question: Question;
	index: number;
	scope: 'host' | 'player';
	onAnswer?: (answer: number) => void | Promise<void>;
}

export default function QuestionPage(props: QuestionPageProps) {
	return (
		<main className="bg-purple-100 flex flex-col h-screen items-center">
			<QuestionTop
				qNum={props.index + 1}
				qText={props.question.questionText}
				qTime={props.question.endTime}
			></QuestionTop>
			<QuestionAnswers
				answers={props.question.answerTexts}
				onAnswer={props.onAnswer ?? ((answer) => undefined)}
			></QuestionAnswers>
			{props.scope == 'host' ? (
				<HostQuestionBottom numAnswered={5} numPlayers={5} />
			) : (
				// TODO this is hardcoded, get from startQuestion message
				<PlayerQuestionBottom name="your name" score={5000} />
			)}
		</main>
	);
}
