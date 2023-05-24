import Link from 'next/link';
import { useState } from 'react';

import EditorGuide from '@/components/EditorPages/EditorTutorial';
import TimerSetter from '@/components/EditorPages/TimerSetter';

export default function EditorNewPage() {
	const [timerValue, setTimerValue] = useState(15);

	return (
		<main className="bg-purple-100 h-screen flex flex-col items-center justify-center text-black font-extrabold">
			<div className="w-5/6 h-full flex flex-col items-center justify-center">
				<div className="w-fit bg-gray-100 border border-black px-6 py-1 -mb-6 text-lg z-20 xl:text-2xl 2xl:px-8 2xl:py-2 2xl:text-3xl">
					Create your own Quiz!
				</div>

				<div className="w-full h-4/5 bg-purple-500 flex flex-col items-center justify-center p-6 text-base rounded-3xl z-10 xl:text-xl 2xl:text-2xl">
					<EditorGuide
						tutorialText={`On this page you can pick a name for your quiz and set a default timer
					(You can change the timer for each individual question later)`}
					/>

					<Link
						href="/upload"
						className="self-start bg-purple-50 px-12 py-1 mb-1 rounded-lg text-white text-center shadow-heavy text-base hover:brightness-110 2xl:px-16 2xl:mb-2 2xl:text-lg"
					>
						Back
					</Link>

					<div className="w-full h-full flex flex-col items-center justify-around bg-gray-100 bg-opacity-50 rounded-xl my-2 shadow-heavy">
						<div className="w-2/3 flex flex-col items-center justify-center">
							<div className="w-3/5 bg-white bg-opacity-50 px-4 py-1 rounded-lg text-center mb-2 lg:py-2 lg:mb-3 2xl:py-4 2xl:mb-6">
								Choose a name for your Quiz
							</div>
							<div className="w-2/3 bg-white rounded-lg p-2 shadow-heavy 2xl:p-3">
								<input
									type="text"
									placeholder="Quiz name"
									className="w-full border border-black text-center p-1 lg:p-2 2xl:p-3"
								></input>
							</div>
						</div>
						<div className="w-2/5 bg-white bg-opacity-50 flex justify-between px-4 py-1 rounded-lg text-center lg:py-2 2xl:py-4">
							<div className="pl-4">Set default timer:</div>
							<TimerSetter
								initTimerValue={timerValue}
								onChange={(v) => setTimerValue(v)}
							/>
						</div>
					</div>

					<Link
						href="/editor/questions"
						className="bg-orange-200 hover:brightness-110 border-1 border-gray-200 rounded-lg px-4 py-1 mt-1 text-white text-center shadow-heavy 2xl:mt-2"
					>
						Add Questions
					</Link>
				</div>
			</div>
		</main>
	);
}
