import Image from 'next/image';
import logo2 from '../public/logo2.png';
import { Inter } from 'next/font/google';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

export default function hostWaiting() {
	return (
		<main
			className={`${inter.variable} w-full font-sans bg-purple-100 flex flex-col items-center p-8`}
		>
			<div className="flex flex-row items-center justify-center w-full">
				<div className="bg-gray-100 w-full flex flex-row items-center justify-between font-extrabold shadow-heavy rounded-xl p-8">
					<div>
						<div className="text-4xl">Join with the code:</div>
						<div className="text-8xl">XXXXX</div>
					</div>
					<div className="flex flex-col p-8">
						<div className="text-4xl">Options:</div>
						<form className="text-2xl">
							<label>
								Time Limit:
								<input type="text" />
							</label>
						</form>
						<form className="text-2xl">
							<label>
								Max Players:
								<input type="text" />
							</label>
						</form>
					</div>
					<button
						className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl p-8 mx-2 text-white text-center text-6xl shadow-md"
						type="button"
						onClick={() => {}}
					>
						Start
					</button>
				</div>
				<Image
					alt="Kakaw logo"
					src={logo2}
					width={189}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
			</div>
			<div className="flex flex-col">
				<div className="text-4xl font-extrabold">Participants (x)</div>
				<div></div>
			</div>
		</main>
	);
}
