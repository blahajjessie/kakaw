import Image from 'next/image';

import happy_kaw from 'public/happy_kaw.png';
import speech_big from 'public/speech_big.svg';
import speech_small from 'public/speech_small.svg';

export default function EditorGuide() {
	return (
		<div className="w-1/4 h-2/5 absolute bottom-[70%] right-[0%]">
			<div className="absolute bottom-[50%] right-[60%] w-[50%] h-[50%] text-sm p-2 z-30 lg:text-base 2xl:text-xl">
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
			<Image
				alt="happy kaw"
				src={happy_kaw}
				width={200}
				style={{
					position: 'absolute',
					bottom: '0%',
					right: '0%',
					width: '75%',
					cursor: 'pointer',
					zIndex: '20',
				}}
			/>
		</div>
	);
}
