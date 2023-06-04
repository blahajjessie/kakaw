import React from 'react';
import { NextPage } from 'next';

import HostWaiting from '@/components/WaitingPages/HostWaiting';
import { useRouter } from 'next/router';
import useKakawGame, { Stage } from '@/lib/useKakawGame';
import HostQuestionPage from '@/components/HostQuestionPage';

const HostGameRouter: NextPage<{}> = () => {
	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	const { connected, error, game } = useKakawGame();

	switch (game.stage) {
		case Stage.WaitingRoom:
			return <HostWaiting />;
		case Stage.Question:
			return (
				<HostQuestionPage
					question={game.currentQuestion}
					index={game.questionIndex}
					postQuestion={false}
				/>
			);
		case Stage.PostQuestion:
			return (
				<HostQuestionPage
					question={game.currentQuestion}
					index={game.questionIndex}
					postQuestion={true}
				/>
			);
	}
	throw new Error('unreachable');
};

// this line disables server side rendering; otherwise, it is rendered with an empty query which
// causes an error in useConnection
HostGameRouter.getInitialProps = async () => ({});
export default HostGameRouter;
