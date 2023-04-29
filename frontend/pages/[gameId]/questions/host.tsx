import { Inter } from 'next/font/google';

import QuestionTop from '@/components/QuestionTop';
import HostQuestionAnswers from '@/components/PlayerQuestionAnswers';
import HostQuestionBottom from '@/components/HostQuestionBottom';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<main className="bg-purple-100 flex flex-col h-screen items-center">
			<QuestionTop
				qNum={1}
				qText={'What is your quest?'}
				qTime={75}
			></QuestionTop>
			<HostQuestionAnswers
				answers={[
					'To pass 115a',
					'To make a real app',
					'To have something to put on my GitHub',
					'To seek the holy grail',
				]}
			></HostQuestionAnswers>
			<HostQuestionBottom numAnswered={2} numPlayers={5}></HostQuestionBottom>
		</main>
	);
}
