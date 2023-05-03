import Image from 'next/image';
import { Inter } from 'next/font/google';

import logo2 from 'public/logo2.png';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<main className="w-full h-screen bg-purple-100 flex flex-col items-center justify-center font-extrabold">
			<button className="absolute top-4 right-4 bg-purple-50 self-end px-8 py-2 rounded-lg text-xl text-white shadow-heavy">
				Continue
			</button>
			<div className="w-4/5 h-full flex flex-col items-center justify-center">
				<Image alt="logo2" src={logo2} width={150} className="-mb-6" />
				<div className="w-min bg-gray-100 border border-black px-4 py-1 text-3xl z-20">
					Leaderboard
				</div>
				<div className="w-full h-2/3 bg-purple-500 pl-14 pr-24 py-14 -mt-6 rounded-xl z-10">
					<div className="bg-gray-100 bg-opacity-50 flex flex-row items-center pl-12 py-2 my-4 text-lg text-white rounded-lg">
						<span>You</span>
						<span className="ml-auto">2000</span>
					</div>
					<div className="bg-gray-100 bg-opacity-50 flex flex-row items-center pl-8 py-2 my-4 text-lg text-white rounded-lg">
						<span>Player 1</span>
						<span className="ml-auto">1500</span>
					</div>
				</div>
			</div>
		</main>
	);
}
