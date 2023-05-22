import QuestionPage from '@/components/QuestionPage';
import PlayerWaiting from '@/components/WaitingPages/PlayerWaiting';
import { apiCall } from '@/lib/api';
import useKakawGame, { Stage } from '@/lib/useKakawGame';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const PlayerGameRouter: NextPage<{}> = () => {
	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	const { connected, error, game } = useKakawGame();

	const [answering, setAnswering] = useState(false);

	async function sendAnswer(answer: number) {
		if (game.stage != Stage.Question || answering) {
			return;
		}

		setAnswering(true);

		try {
			const response = await apiCall(
				'POST',
				`/games/${gameId}/questions/${game.questionIndex}/answer`,
				{
					userId: playerId,
					answer,
				}
			);
			if (response.status != 200) {
				throw new Error('Received error from server');
			}
			const result = await response.json();
			if (!result.ok) {
				throw new Error(`Received error from server: ${result.err}`);
			}
		} catch (e) {
			alert(`Error answering question: ${JSON.stringify(e)}`);
		}
	}

	switch (game.stage) {
		case Stage.WaitingRoom:
			return <PlayerWaiting />;
		case Stage.Question:
			return (
				<QuestionPage
					scope="player"
					question={game.currentQuestion}
					index={game.questionIndex}
					onAnswer={sendAnswer}
				/>
			);
	}
	throw new Error('unreachable');
};

// this line disables server side rendering; otherwise, it is rendered with an empty query which
// causes an error in useConnection
PlayerGameRouter.getInitialProps = async () => ({});
export default PlayerGameRouter;
