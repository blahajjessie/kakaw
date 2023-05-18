import Image from 'next/image';

import happy_kaw from 'public/happy_kaw.png';
import speech_big from 'public/speech_big.svg';
import speech_small from 'public/speech_small.svg';

export default function EditorGuide() {
	return (
		<div className="w-1/4 h-2/5 absolute bottom-[70%] right-[0%]">
			{/* <div className="absolute bottom-[50%] right-[60%] w-24 h-16 bg-white flex items-center justify-center rounded-[100%] text-center text-sm p-2 z-30 lg:text-base lg:w-32 lg:h-20 2xl:text-xl 2xl:w-36 2xl:h-24 before:content-[''] before:absolute before:bottom-[10%] before:right-[8%] before:w-0 before:border-r-[0.8em] before:border-r-white before:border-t-[1.2em] before:border-t-transparent before:border-b-[0.2em] before:border-b-transparent">
				Tap me for help!
			</div> */}
			<Image alt="small speech bubble" src={speech_small} width={20}></Image>
			<div className="absolute bottom-[50%] right-[60%] w-24 flex items-center justify-center text-center text-sm p-2 z-30 lg:text-base 2xl:text-xl">
				Tap me for help!
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
