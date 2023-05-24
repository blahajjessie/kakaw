import { useState } from 'react';

import useConnection from './useConnection';

export enum Stage {
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
			stage: Stage.WaitingRoom;
			// id -> username
			players: Map<string, string>;
	  }
	| {
			stage: Stage.Question;
			questionIndex: number;
			currentQuestion: Question;
	  }
	| {
			stage: Stage.PostQuestion;
	  };

export default function useKakawGame(): {
	connected: boolean;
	error?: string;
	game: KakawGame;
} {
	const [connected, setConnected] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const [game, setGame] = useState<KakawGame>({
		stage: Stage.WaitingRoom,
		players: new Map(),
	});

	useConnection({
		onOpen() {
			setConnected(true);
		},

		onMessage(type, event) {
			console.log(`received message: ${type}, ${JSON.stringify(event)}`);

			switch (type) {
				case 'startQuestion':
					setGame({
						stage: Stage.Question,
						questionIndex: event.index,
						currentQuestion: {
							questionText: event.questionText,
							answerTexts: event.answerTexts,
							time: event.time,
						},
					});
					break;
				case 'endQuestion':
					setGame({
						stage: Stage.PostQuestion,
					});
					break;

				// TODO: change to playerAction
				case 'lobby':
					const currentPlayers =
						game.stage == Stage.WaitingRoom ? game.players.entries() : [];

					setGame({
						stage: Stage.WaitingRoom,
						players: new Map([
							...currentPlayers,
							...Object.entries(event.players as Record<string, string>),
						]),
					});
					break;
			}
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

	return { connected, error, game };
}
