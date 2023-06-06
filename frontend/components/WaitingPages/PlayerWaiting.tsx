import Image from 'next/image';
import Head from 'next/head';

import logo2 from '@/public/logo2.png';

export default function PlayerWaiting() {
	return (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<Head>
				<title>Waiting Room - Kakaw!</title>
			</Head>
			<div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">
				<Image
					alt="Kakaw logo"
					src={logo2}
					width={189}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
				<div className="text-orange-200 text-4xl text-center">
					You entered a game!
				</div>
				<div className="text-black text-2xl text-center">
					Your quiz will start soon...
				</div>
			</div>
		</main>
	);
}
