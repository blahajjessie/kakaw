import React, { useState } from 'react';
import { NextPage } from 'next';

import HostWaiting from '@/components/WaitingPages/HostWaiting';
import useKakawGame, { Stage } from '@/lib/useKakawGame';
import HostQuestionPage from '@/components/HostQuestionPage';
import LeaderboardPage from '@/components/LeaderboardPage';
import MessagePage from '@/components/MessagePage';
import failKaw from '@/public/fail_kaw.png';
import Podium from '@/components/Podium';

const HostGameRouter: NextPage<{}> = () => {
	const { connected, error, game } = useKakawGame();
	const [viewingLeaderboard, setViewingLeaderboard] = useState(false);
	const [viewingPodium, setViewingPodium] = useState(true);

	if (!connected) {
		return (
			<MessagePage
				pageTitle="Disconnected"
				heading="Disconnected"
				body={`${
					error ?? 'The connection was interrupted'
				}. You may be able to rejoin by reloading the page.`}
				image={failKaw}
			/>
		);
	}

	switch (game.stage) {
		case Stage.WaitingRoom:
			return <HostWaiting />;
		case Stage.Question:
			if (viewingLeaderboard) {
				setViewingLeaderboard(false);
			}
			return (
				<HostQuestionPage
					question={game.currentQuestion}
					index={game.questionIndex}
					postQuestion={false}
				/>
			);
		case Stage.PostQuestion:
			if (viewingLeaderboard) {
				return (
					<LeaderboardPage
						entries={game.leaderboard}
						index={game.questionIndex}
					/>
				);
			} else {
				return (
					<HostQuestionPage
						question={game.currentQuestion}
						index={game.questionIndex}
						postQuestion={true}
						onContinue={() => setViewingLeaderboard(true)}
					/>
				);
			}

		case Stage.PostGameHost:
			if (viewingPodium) {
				return (
					<Podium
						player1={game.leaderboard[0]}
						player2={game.leaderboard[1]}
						player3={game.leaderboard[2]}
						onContinue={() => setViewingPodium(false)}
					/>
				);
			} else {
				throw 'unimplemented';
			}
	}
	throw new Error('unreachable');
};

// this line disables server side rendering; otherwise, it is rendered with an empty query which
// causes an error in useConnection
HostGameRouter.getInitialProps = async () => ({});
export default HostGameRouter;
