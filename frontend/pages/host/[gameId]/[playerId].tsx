import React from 'react';
import { NextPage } from 'next';

import HostWaiting from '@/components/WaitingPages/HostWaiting';
import { useRouter } from 'next/router';
import useKakawGame, { Stage } from '@/lib/useKakawGame';
import QuestionPage from '@/components/QuestionPage';

const HostGameRouter: NextPage<{}> = () => {
	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	const { connected, error, game } = useKakawGame();

	switch (game.stage) {
		case Stage.WaitingRoom:
			return <HostWaiting gameId={gameId} />;
		case Stage.Question:
			return (
				<QuestionPage
					scope="host"
					question={game.currentQuestion}
					index={game.questionIndex}
				/>
			);
	}
	throw new Error('unreachable');
};

// this line disables server side rendering; otherwise, it is rendered with an empty query which
// causes an error in useConnection
HostGameRouter.getInitialProps = async () => ({});
export default HostGameRouter;
