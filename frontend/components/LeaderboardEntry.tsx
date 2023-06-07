import Image from 'next/image';

import lb_up from 'public/lb_up.svg';
import lb_equal from 'public/lb_equal.svg';

import { LeaderboardEntry as LeaderboardEntryType } from '@/lib/useKakawGame';

export default function LeaderboardEntry({
	name,
	score,
	isSelf,
	positionChange,
}: LeaderboardEntryType) {
	// show up, down, or equal icon based on if/how player's position has changed
	const positionIcon =
		positionChange === null ? undefined : positionChange > 0 ? (
			<Image alt="position change icon" src={lb_up} width={20} />
		) : positionChange < 0 ? (
			<Image
				alt="position change icon"
				src={lb_up}
				width={20}
				className="rotate-180"
			/>
		) : (
			<Image alt="position change icon" src={lb_equal} width={20} />
		);

	if (isSelf) {
		return (
			<div className="bg-gray-100 bg-opacity-50 outline outline-3 outline-white flex flex-row items-center pl-8 pr-4 py-2 my-5 text-white rounded-lg shadow-heavy hover:brightness-110 sm:pl-12">
				<span className="mx-2">You</span>
				<span className="ml-auto mr-4">{score}</span>
				{positionIcon}
			</div>
		);
	} else {
		return (
			<div className="bg-gray-100 bg-opacity-50 outline outline-1 outline-gray-200 flex flex-row items-center pl-4 pr-4 py-2 my-5 text-white rounded-lg shadow-heavy hover:brightness-110 sm:pl-8">
				<span className="mx-2">{name}</span>
				<span className="ml-auto mr-4">{score}</span>
				{positionIcon}
			</div>
		);
	}
}
