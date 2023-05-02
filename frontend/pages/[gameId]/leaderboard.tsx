import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<main className="bg-purple-100 flex flex-col h-screen">
			<button className="bg-purple-50 self-end px-8 py-2 m-4 rounded-lg font-extrabold text-xl text-white shadow-heavy">
				Continue
			</button>
			<div className="self-center font-extrabold">
				<div className="bg-gray-100 border border-black px-4 py-2 text-3xl">
					Leaderboard
				</div>
				<div className="bg-purple-500 px-12 py-16 rounded-xl">
					<div className="text-lg text-white">You</div>
					<div className="text-lg text-white">Player 1</div>
				</div>
			</div>
		</main>
	);
}
