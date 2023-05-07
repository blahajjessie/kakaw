import React from 'react';
import { NextPage } from 'next';
import useConnection from '@/lib/useConnection';

const HostGameRouter: NextPage<{}> = () => {
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

	return <h1>Waiting to receive data from server...</h1>;
};

HostGameRouter.getInitialProps = async () => ({});
export default HostGameRouter;
