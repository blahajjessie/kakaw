import { useState } from 'react';
import { atom, selector, useRecoilState, useResetRecoilState } from 'recoil';

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
	endTime: number;
	explanations?: string[];
}

export type KakawGame =
	| {
			stage: Stage.WaitingRoom;
	  }
	| {
			stage: Stage.Question;
			questionIndex: number;
			currentQuestion: Question;
	  }
	| {
			stage: Stage.PostQuestion;
			questionIndex: number;
			currentQuestion: Question;
			scoreChange: number;
			correct: boolean;
			correctAnswers: number[];
	  };

const kakawGameState = atom<KakawGame>({
	key: 'kakawGameState',
	default: { stage: Stage.WaitingRoom },
});

export const currentPlayersState = atom<Map<string, string>>({
	key: 'currentPlayersState',
	default: new Map(),
});

export const usernameState = atom({ key: 'usernameState', default: '' });

export const scoreState = atom({ key: 'scoreState', default: 0 });

export default function useKakawGame(): {
	connected: boolean;
	error?: string;
	game: KakawGame;
} {
	const [connected, setConnected] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const [game, setGame] = useRecoilState(kakawGameState);
	const [currentPlayers, setCurrentPlayers] =
		useRecoilState(currentPlayersState);
	const [username, setUsername] = useRecoilState(usernameState);
	const [score, setScore] = useRecoilState(scoreState);

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
							explanations: event.explanations ?? null,
							// We store the timestamp when the question will end, NOT the amount of
							// time remaining. This should make timers easier to implement.
							endTime: Date.now() + event.time,
						},
					});
					setUsername(event.username);
					setScore(event.score);
					break;
				case 'endQuestion':
					setGame({
						stage: Stage.PostQuestion,
						questionIndex: event.index,
						currentQuestion: {
							questionText: event.questionText,
							answerTexts: event.answerTexts,
							endTime: Infinity,
						},
						scoreChange: event.scoreChange,
						correct: event.correct,
						correctAnswers: event.correctAnswers,
					});
					setUsername(event.username);
					setScore(event.score);
					break;

				case 'playerAction':
					setCurrentPlayers(
						new Map([
							...currentPlayers.entries(),
							...Object.entries(event.player as Record<string, string>),
						])
					);
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
