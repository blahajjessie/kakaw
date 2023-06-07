import { useState } from 'react';
import PlayerQuestionPage, {
	PlayerPostQuestionPage,
} from '@/components/PlayerQuestionPage';
import MessagePage from '@/components/MessagePage';
import useKakawGame, {
	Stage,
	scoreState,
	usernameState,
} from '@/lib/useKakawGame';
import { NextPage } from 'next';
import LeaderboardPage from '@/components/LeaderboardPage';
import logo from '@/public/logo2.png';
import failKaw from '@/public/fail_kaw.png';
import Podium from '@/components/Podium';
import PostGamePlayer from '@/components/PostGamePlayer';
import { useRecoilValue } from 'recoil';

const PlayerGameRouter: NextPage<{}> = () => {
	const { connected, error, game } = useKakawGame();

	const [viewingLeaderboard, setViewingLeaderboard] = useState(false);
	const [viewingPodium, setViewingPodium] = useState(true);

	const username = useRecoilValue(usernameState);
	const score = useRecoilValue(scoreState);

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
			return (
				<MessagePage
					pageTitle="Waiting Room"
					heading="You entered a game!"
					body="Your quiz will start soon..."
					image={logo}
				/>
			);

		case Stage.Question:
			if (viewingLeaderboard) {
				setViewingLeaderboard(false);
			}
			return (
				<PlayerQuestionPage
					question={game.currentQuestion}
					index={game.questionIndex}
				/>
			);

		case Stage.PostQuestion:
			if (viewingLeaderboard) {
				return (
					<LeaderboardPage
						entries={game.leaderboard}
						totalQuestions={game.totalQuestions}
					/>
				);
			} else {
				return (
					<PlayerPostQuestionPage
						question={game.currentQuestion}
						index={game.questionIndex}
						playerAnswer={game.playerAnswer}
						onLeaderboardNavigation={() => setViewingLeaderboard(true)}
						scoreChange={game.scoreChange}
					/>
				);
			}

		case Stage.PostGamePlayer:
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
				return <PostGamePlayer {...game} username={username} score={score} />;
			}
	}
	throw new Error('unreachable');
};

// this line disables server side rendering; otherwise, it is rendered with an empty query which
// causes an error in useConnection
PlayerGameRouter.getInitialProps = async () => ({});
export default PlayerGameRouter;
