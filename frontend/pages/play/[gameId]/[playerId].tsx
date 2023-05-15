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

	return (
		<div>
			<p>
				Connected: {connected ? 'yes' : 'no'}
				<br />
				Error: {error}
				<br />
				Stage: {Stage[game.stage]}
			</p>
			<p>
				Game data: <code>{JSON.stringify(game)}</code>
			</p>
		</div>
	);
};

// this line disables server side rendering; otherwise, it is rendered with an empty query which
// causes an error in useConnection
PlayerGameRouter.getInitialProps = async () => ({});
export default PlayerGameRouter;
