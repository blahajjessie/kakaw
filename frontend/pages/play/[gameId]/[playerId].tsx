import QuestionPage from '@/components/QuestionPage';
import PlayerWaiting from '@/components/WaitingPages/PlayerWaiting';
import useKakawGame, { Stage } from '@/lib/useKakawGame';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const PlayerGameRouter: NextPage<{}> = () => {
	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	const { connected, error, game } = useKakawGame();

	switch (game.stage) {
		case Stage.WaitingRoom:
			return <PlayerWaiting />;
		case Stage.Question:
			return (
				<QuestionPage
					scope="player"
					question={game.currentQuestion}
					index={game.questionIndex}
				/>
			);
	}
	throw new Error('unreachable');
};

// this line disables server side rendering; otherwise, it is rendered with an empty query which
// causes an error in useConnection
PlayerGameRouter.getInitialProps = async () => ({});
export default PlayerGameRouter;
