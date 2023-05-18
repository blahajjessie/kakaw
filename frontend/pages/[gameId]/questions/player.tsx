import QuestionTop from '@/components/QuestionPages/QuestionTop';
import QuestionAnswers from '@/components/QuestionPages/QuestionAnswers';
import PlayerQuestionBottom from '@/components/QuestionPages/PlayerQuestionBottom';

export default function PlayerQuestionPage() {
	return (
		<main className="bg-purple-100 flex flex-col h-screen items-center">
			<QuestionTop
				qNum={1}
				qText={'What is your quest?'}
				qTime={75}
			></QuestionTop>
			<QuestionAnswers
				answers={[
					'To pass 115a',
					'To make a real app',
					'To have something to put on my GitHub',
					'To seek the holy grail',
				]}
			></QuestionAnswers>
			<PlayerQuestionBottom
				name={'Student Name'}
				score={5000}
			></PlayerQuestionBottom>
		</main>
	);
}