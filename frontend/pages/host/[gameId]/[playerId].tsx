import React from 'react';
import { NextPage } from 'next';
import useConnection from '@/lib/useConnection';

import HostWaiting from '@/components/WaitingPages/HostWaiting';
import { useRouter } from 'next/router';

const HostGameRouter: NextPage<{}> = () => {
	const router = useRouter();
	const { gameId, playerId } = router.query as {
		gameId: string;
		playerId: string;
	};

	useConnection({
		onEvent(type, event) {
			console.log(`got ${type} message: ${JSON.stringify(event)}`);
		},

		onError(error) {
			console.error(error);
		},

		onClose(reason) {
			console.log(`connection closed: ${reason}`);
		},
	});

	return <HostWaiting gameId={gameId} />;
};

// this line disables server side rendering; otherwise, it is rendered with an empty query which
// causes an error in useConnection
HostGameRouter.getInitialProps = async () => ({});
export default HostGameRouter;
