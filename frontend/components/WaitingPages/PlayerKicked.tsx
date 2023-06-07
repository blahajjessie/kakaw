import Image from 'next/image';
import Head from 'next/head';

import fail_kaw from '@/public/fail_kaw.png';

export default function PlayerWaiting() {
	return (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<Head>
				<title>Kicked - Kakaw!</title>
			</Head>
			<div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">
				<Image
					alt="Kakaw logo"
					src={fail_kaw}
					width={189}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
				<div className="text-orange-200 text-4xl text-center">Oh no!</div>
				<div className="text-black text-2xl text-center">
					You have been kicked from the session by the host.
				</div>
			</div>
		</main>
	);
}
