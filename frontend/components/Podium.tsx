import Image, { StaticImageData } from 'next/image';
import Head from 'next/head';

import medal1 from '@/public/medal1.png';
import medal2 from '@/public/medal2.png';
import medal3 from '@/public/medal3.png';

import { LeaderboardEntry } from '@/lib/useKakawGame';

export type PodiumProps = {
	player1?: LeaderboardEntry;
	player2?: LeaderboardEntry;
	player3?: LeaderboardEntry;
	onContinue: () => void;
};

function PodiumEntry(props: {
	player: LeaderboardEntry;
	image: StaticImageData;
	imageAlt: string;
	color: string;
	height: string;
	size: string;
}) {
	return (
		<div className="w-1/3 h-full flex flex-col items-center justify-end sm:w-1/4">
			<div className="text-white">
				{props.player.isSelf ? 'You' : props.player.name}
			</div>
			<div className="text-white mb-1 2xl:mb-2">{props.player.score}</div>
			<div
				className={`w-full ${props.height} ${props.color} flex items-start justify-center pt-6 sm:pt-8`}
			>
				<div className={`relative ${props.size}`}>
					<Image
						alt={props.imageAlt}
						src={props.image}
						fill
						sizes="(max-width: 640px) 40vw, 10vw"
						className="object-contain"
					/>
				</div>
			</div>
		</div>
	);
}

export default function Podium({
	player1,
	player2,
	player3,
	onContinue,
}: PodiumProps) {
	return (
		<main className="w-full h-screen bg-purple-100 bg-results bg-fixed bg-center bg-cover flex flex-row items-end justify-center font-extrabold text-lg text-shadow sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
			<Head>
				<title>Final Results - Kakaw!</title>
			</Head>
			<button
				className="absolute top-6 right-6 bg-purple-50 self-end px-8 py-2 rounded-lg text-xl text-white shadow-heavy hover:brightness-110 2xl:text-2xl"
				onClick={onContinue}
			>
				Continue
			</button>
			{player2 && (
				<PodiumEntry
					player={player2}
					image={medal2}
					imageAlt="second place"
					height="h-2/5"
					color="bg-gray-400"
					size="w-[6rem] h-[6rem] xl:w-[8rem] xl:h-[8rem] 2xl:w-[11rem] 2xl:h-[11rem]"
				/>
			)}
			{player1 && (
				<PodiumEntry
					player={player1}
					image={medal1}
					imageAlt="first place"
					height="h-2/3"
					color="bg-gray-100"
					size="w-[6.5rem] h-[6.5rem] xl:w-[8.6rem] xl:h-[8.6rem] 2xl:w-[12rem] 2xl:h-[12rem]"
				/>
			)}
			{player3 && (
				<PodiumEntry
					player={player3}
					image={medal3}
					imageAlt="third place"
					height="h-1/3"
					color="bg-gray-500"
					size="w-[5.5rem] h-[5.5rem] xl:w-[7.4rem] xl:h-[7.4rem] 2xl:w-[10rem] 2xl:h-[10rem]"
				/>
			)}
		</main>
	);
}
