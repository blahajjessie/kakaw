import PlayerQuestionPage, {
	PlayerPostQuestionPage,
} from '@/components/PlayerQuestionPage';
import PlayerWaiting from '@/components/WaitingPages/PlayerWaiting';
import useKakawGame, { Stage } from '@/lib/useKakawGame';
import { NextPage } from 'next';

const PlayerGameRouter: NextPage<{}> = () => {
	const { connected, error, game } = useKakawGame();

	switch (game.stage) {
		case Stage.WaitingRoom:
			return <PlayerWaiting />;
		case Stage.Question:
			return (
				<PlayerQuestionPage
					question={game.currentQuestion}
					index={game.questionIndex}
				/>
			);
		case Stage.PostQuestion:
			return (
				<PlayerPostQuestionPage
					question={game.currentQuestion}
					index={game.questionIndex}
					playerAnswer={game.playerAnswer}
					scoreChange={game.scoreChange}
				/>
			);
	}
	throw new Error('unreachable');
};

// this line disables server side rendering; otherwise, it is rendered with an empty query which
// causes an error in useConnection
PlayerGameRouter.getInitialProps = async () => ({});
export default PlayerGameRouter;
