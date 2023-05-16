import Image from 'next/image';
import Link from 'next/link';

import happy_kaw from 'public/happy_kaw.png';

export default function EditorPage() {
	return (
		<main className="bg-purple-100 h-screen flex flex-col items-center justify-center text-black font-extrabold">
			<div className="w-4/5 h-full flex flex-col items-center justify-center">
				<div className="w-fit bg-gray-100 border border-black px-6 py-1 -mb-6 text-2xl z-20 2xl:text-3xl">
					Create your own Quiz!
				</div>

				<div className="relative w-full h-4/5 bg-purple-500 flex flex-col items-center justify-center px-12 py-6 text-lg rounded-3xl z-10 2xl:text-xl">
					<Image
						alt="happy kaw"
						src={happy_kaw}
						width={180}
						style={{
							position: 'absolute',
							bottom: '75%',
							right: '2%',
						}}
					/>

					<Link
						href="/upload"
						className="self-start bg-purple-50 px-14 py-1 mb-2 rounded-lg text-white text-center shadow-heavy text-base hover:brightness-110 2xl:text-lg"
					>
						Back
					</Link>

					<div className="w-full h-full flex flex-col items-center justify-around bg-gray-100 bg-opacity-50 rounded-xl my-2 shadow-heavy">
						<div className="bg-white bg-opacity-50 px-8 py-2 rounded-lg text-center">
							Choose a name for your Quiz
						</div>
						<input
							type="text"
							placeholder="Quiz name"
							className="text-center"
						></input>
						<div className="bg-white bg-opacity-50 px-8 py-2 rounded-lg text-center">
							Set default timer:
						</div>
					</div>

					<button
						className="bg-orange-200 hover:brightness-110 border-1 border-gray-200 rounded-lg px-4 py-1 mt-2 text-white text-center text-lg shadow-heavy"
						type="button"
					>
						Add Questions
					</button>
				</div>
			</div>
		</main>
	);
}
