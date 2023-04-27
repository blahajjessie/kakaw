import Image from 'next/image';
import { Inter } from 'next/font/google';

import Link from 'next/link';
import QuestionTop from '@/components/QuestionTop';
import QuestionAnswers from '@/components/QuestionAnswers';
import HostQuestionBottom from '@/components/HostQuestionBottom';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<QuestionTop></QuestionTop>
			<QuestionAnswers></QuestionAnswers>
			<HostQuestionBottom></HostQuestionBottom>
		</main>
	);
}
