import QuestionTop from '@/components/QuestionPages/QuestionTop';
import QuestionAnswers from '@/components/QuestionPages/QuestionAnswers';
import HostQuestionBottom from '@/components/QuestionPages/HostQuestionBottom';

export default function HostQuestionPage() {
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
				explanations={[
					'To successfully complete the course 115a',
					'To develop a functional and professional application',
					'To showcase my projects on the popular platform GitHub',
					'To embark on a legendary and noble quest for the holy grail',
				]}
			></QuestionAnswers>
			<HostQuestionBottom numAnswered={2} numPlayers={5}></HostQuestionBottom>
		</main>
	);
}
