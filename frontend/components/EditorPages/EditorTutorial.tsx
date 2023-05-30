import Image from 'next/image';
import Link from 'next/link';

import happy_kaw from 'public/happy_kaw.png';
import fail_kaw from 'public/fail_kaw.png';
import speech_big from 'public/speech_big.svg';
import speech_small from 'public/speech_small.svg';
import speech_yell from 'public/speech_yell.svg';

interface EditorTutorialProps {
	state: string;
	toggleState: () => void;
}

export default function EditorTutorial({
	state,
	toggleState,
}: EditorTutorialProps) {
	function insertSmall(content: JSX.Element): JSX.Element {
		return (
			<div className="absolute bottom-[83%] right-[18%] w-[10%] h-[14%] text-sm z-30 lg:text-base 2xl:text-xl">
				<Image
					alt="small speech bubble"
					src={speech_small}
					width={100}
					style={{
						position: 'absolute',
						top: '0%',
						left: '0%',
						width: '100%',
						height: '100%',
					}}
				/>
				<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-center p-2">
					{content}
				</div>
			</div>
		);
	}

	function insertLarge(content: JSX.Element): JSX.Element {
		return (
			<div
				className="absolute top-[22%] left-[32%] w-[48%] h-1/2 z-30 pointer-events-auto"
				onClick={toggleState}
			>
				<Image
					alt="big speech bubble"
					src={speech_big}
					sizes="(max-width: 640px) 40vw, 30vw"
					fill
					style={{
						position: 'absolute',
						top: '0%',
						left: '0%',
					}}
				/>
				<div className="absolute top-6 bottom-0 right-[32%] m-auto w-3/5 flex items-center justify-center text-center whitespace-pre-line z-20 pointer-events-auto text-sm sm:text-base lg:text-lg 2xl:text-2xl">
					{content}
				</div>
			</div>
		);
	}

	function insertYell(content: JSX.Element): JSX.Element {
		return (
			<div
				className="absolute top-0 bottom-0 left-0 right-0 m-auto w-1/2 h-3/4 z-30 pointer-events-auto"
				onClick={toggleState}
			>
				<Image
					alt="yell speech bubble"
					src={speech_yell}
					sizes="(max-width: 640px) 40vw, 30vw"
					fill
					style={{
						position: 'absolute',
						top: '0%',
						left: '0%',
					}}
				/>
				<div className="absolute top-0 bottom-0 left-0 right-0 m-auto w-1/2 flex items-center justify-center text-center whitespace-pre-line z-20 pointer-events-auto text-sm sm:text-base lg:text-lg 2xl:text-2xl">
					{content}
				</div>
			</div>
		);
	}

	return (
		<div className="absolute w-full h-full pointer-events-none">
			<Image
				alt="tutorial bird"
				src={state === 'check' ? fail_kaw : happy_kaw}
				width={160}
				style={{
					position: 'absolute',
					bottom: '72%',
					right: '6%',
					width: '12%',
					cursor: 'pointer',
					pointerEvents: 'auto',
					zIndex: '20',
				}}
				onClick={toggleState}
			/>

			{state === 'tap' && insertSmall(<div>Tap me for help!</div>)}

			{state === 'title' &&
				insertLarge(
					<div>
						On this page, you can pick a name for your quiz and set a default
						timer.
						<br />
						(You can change the timer for each individual question later.)
					</div>
				)}

			{state === 'questions' &&
				insertLarge(
					<div>
						You can change the timer and add up to 4 answers for each question.
						Answer explanations are optional, but must either be defined for
						every answer or left blank for each question.
					</div>
				)}

			{state === 'leave' &&
				insertLarge(
					<div className="flex flex-col items-center justify-center">
						<span className="text-base sm:text-lg lg:text-xl 2xl:text-3xl">
							Are you sure you want to leave?
						</span>
						<br />
						(All progress will be lost)
						<div className="flex items-center justify-between gap-8 mt-4">
							<Link
								href="/upload"
								className="bg-white hover:brightness-95 border border-gray-200 text-orange-200 rounded-lg px-6 py-1 shadow-heavy"
							>
								Yes
							</Link>
							<button className="bg-white hover:brightness-95 border border-gray-200 text-orange-200 rounded-lg px-6 py-1 shadow-heavy">
								No
							</button>
						</div>
					</div>
				)}

			{state === 'check' &&
				insertYell(
					<div>
						<span className="text-base sm:text-lg lg:text-xl 2xl:text-3xl">
							Invalid quiz, oh no!
						</span>
						<br />
						Check that you've filled in every field and marked at least one
						correct answer for each question.
					</div>
				)}
		</div>
	);
}
