import Image from 'next/image';
import { useState } from 'react';

import happy_kaw from 'public/happy_kaw.png';
import speech_big from 'public/speech_big.svg';
import speech_small from 'public/speech_small.svg';

interface EditorTutorialProps {
	tutorialText: string;
}

export default function EditorTutorial({ tutorialText }: EditorTutorialProps) {
	const [showTutorial, setShowTutorial] = useState(false);
	const [showTapHelp, setShowTapHelp] = useState(true);

	function advanceTutorial() {
		setShowTapHelp(false);
		setShowTutorial(!showTutorial);
	}

	return (
		<div className="absolute w-full h-full pointer-events-none">
			<div className="w-1/4 h-2/5 absolute bottom-[68%] right-[8%] pointer-events-auto">
				{showTapHelp && (
					<div className="absolute bottom-[35%] right-[55%] w-[40%] h-[40%] text-sm p-2 z-30 lg:text-base 2xl:text-xl">
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
							Tap me for help!
						</div>
					</div>
				)}

				<Image
					alt="happy kaw"
					src={happy_kaw}
					width={160}
					style={{
						position: 'absolute',
						bottom: '0%',
						right: '0%',
						width: '65%',
						cursor: 'pointer',
						pointerEvents: 'auto',
						zIndex: '20',
					}}
					onClick={advanceTutorial}
				/>
			</div>

			{showTutorial && (
				<div className="absolute w-full h-full">
					<Image
						alt="big speech bubble"
						src={speech_big}
						width={200}
						style={{
							position: 'absolute',
							top: '22%',
							left: '34%',
							width: '43%',
							pointerEvents: 'auto',
						}}
						onClick={() => setShowTutorial(false)}
					/>
					<div
						className="absolute top-0 bottom-0 left-0 right-0 m-auto w-1/4 h-1/3 flex items-center justify-center text-center whitespace-pre-line z-20 pointer-events-auto text-sm sm:text-base lg:text-lg 2xl:text-2xl"
						onClick={() => setShowTutorial(false)}
					>
						{tutorialText}
					</div>
				</div>
			)}
		</div>
	);
}
