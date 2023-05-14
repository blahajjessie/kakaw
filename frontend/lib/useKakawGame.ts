import { useState } from 'react';

import useConnection from './useConnection';

export enum KakawGameStage {
	WaitingRoom,
	Question,
	PostQuestion,
	PostGame,
}

export interface Question {
	questionText: string;
	answerTexts: string[];
	time: number;
}

export type KakawGame =
	| {
			stage: KakawGameStage.WaitingRoom;
	  }
	| {
			stage: KakawGameStage.Question | KakawGameStage.PostQuestion;
			questionIndex: number;
			currentQuestion: Question;
	  };

export default function useKakawGame(): {
	connected: boolean;
	error?: string;
	game: KakawGame;
} {
	const [connected, setConnected] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	useConnection({
		onOpen() {
			setConnected(true);
		},

		onMessage(type, event) {
			console.log(`received message: ${type}, ${JSON.stringify(event)}`);
		},

		onError(error) {
			setConnected(false);
			setError('The connection was interrupted.');
		},

		onClose(reason) {
			setConnected(false);
			if (typeof reason == 'string') {
				setError(`The server closed the connection: ${reason}`);
			} else {
				setError('The connection was interrupted.');
			}
		},
	});

	return { connected, error, game: { stage: KakawGameStage.WaitingRoom } };
}
