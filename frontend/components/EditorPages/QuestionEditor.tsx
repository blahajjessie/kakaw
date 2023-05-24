import Image from 'next/image';
import { useState, useEffect } from 'react';

import TimerSetter from '@/components/EditorPages/TimerSetter';

import editor_plus from '@/public/editor_plus.svg';
import editor_minus from '@/public/editor_minus.svg';

interface QuestionEditorProps {
	questionText: string;
	answerTexts: string[];
	correctAnswers: number[];
	answerExplain: string[];
	time: number;
	points: number;
}

// args later
// {
// 	questionText,
// 	answerTexts,
// 	correctAnswers,
// 	answerExplain,
// 	time,
// 	points,
// }: QuestionEditorProps

export default function QuestionEditor() {
	const [timerValue, setTimerValue] = useState(15);

	return (
		<div className="w-4/5 h-12 bg-gray-100 bg-opacity-50 flex flex-column font-extrabold text-white text-base rounded-lg my-2 lg:text-lg 2xl:text-xl 2xl:h-16">
			<div className="w-full h-12 bg-gray-100 bg-opacity-50 flex flex-row items-center justify-between rounded-lg px-4 shadow-heavy 2xl:h-16">
				<div className="flex flex-row items-center">
					<div className="relative w-4 h-4 mr-4 cursor-pointer">
						<Image alt="editor expand" src={editor_plus} fill />
						{/* <Image alt="editor collapse" src={editor_minus} fill /> */}
					</div>
					<span>Question 1</span>
				</div>

				<div className="bg-gray-100 flex items-center justify-center border border-gray-200 rounded-xl px-2 py-0.5">
					<span>Timer:</span>
					<TimerSetter
						initTimerValue={timerValue}
						onChange={(v) => setTimerValue(v)}
					/>
				</div>
			</div>

			{/* {isExpanded && (<div></div>)} */}
		</div>
	);
}
