import { useState } from 'react';
import { atom, selector, useRecoilState, useResetRecoilState } from 'recoil';

import useConnection from './useConnection';

export enum Stage {
	WaitingRoom,
	Question,
	PostQuestion,
	PostGameHost,
	PostGamePlayer,
}

export interface Question {
	questionText: string;
	answerTexts: string[];
	endTime: number;
	explanations?: string[];
	correctAnswers?: number[];
}

export interface PostGameEntry {
	numCorrect: number;
	numWrong: number;
	username: string;
	score: number;
}

export interface LeaderboardEntry {
	name: string;
	score: number;
	// positive for up, negative for down
	positionChange: number;
	// is this entry for the current player?
	isSelf: boolean;
}

export type KakawGame =
	| {
			stage: Stage.WaitingRoom;
	  }
	| {
			stage: Stage.Question;
			questionIndex: number;
			currentQuestion: Question;
			totalQuestions: number;
	  }
	| {
			stage: Stage.PostQuestion;
			questionIndex: number;
			currentQuestion: Question;
			scoreChange: number;
			correct: boolean;
			playerAnswer: number;
			leaderboard: LeaderboardEntry[];
			totalQuestions: number;
	  }
	| {
			stage: Stage.PostGameHost;
			leaderboard: LeaderboardEntry[];
			players: PostGameEntry[];
	  }
	| {
			stage: Stage.PostGamePlayer;
			leaderboard: LeaderboardEntry[];
			numCorrect: number;
			numWrong: number;
	  };

const kakawGameState = atom<KakawGame>({
	key: 'kakawGameState',
	default: { stage: Stage.WaitingRoom },
});

// In line with the new playerAction message, this is "the players that have completed the current
// action." In waiting room this is the players in the game, and in a question this is the players
// who have answered so far.
export const currentPlayersState = atom<Map<string, string>>({
	key: 'currentPlayersState',
	default: new Map(),
});

export const usernameState = atom({ key: 'usernameState', default: '' });

export const scoreState = atom({ key: 'scoreState', default: 0 });

export const totalPlayersState = atom({ key: 'totalPlayers', default: 0 });

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
	const [_score, setScore] = useRecoilState(scoreState);
	const [_totalPlayers, setTotalPlayers] = useRecoilState(totalPlayersState);

	useConnection({
		onOpen() {
			setConnected(true);

			// restore defaults
			setError(undefined);
			setGame({ stage: Stage.WaitingRoom });
			setCurrentPlayers(new Map());
			setUsername('');
			setScore(0);
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
						totalQuestions: event.totalQuestions,
					});
					setUsername(event.username);
					setScore(event.score);
					setCurrentPlayers(new Map());
					setTotalPlayers(event.totalPlayers);
					break;
				case 'endQuestion':
					setGame({
						stage: Stage.PostQuestion,
						questionIndex: event.index,
						currentQuestion: {
							questionText: event.questionText,
							answerTexts: event.answerTexts,
							endTime: Infinity,
							correctAnswers: event.correctAnswers,
							explanations: event.explanations,
						},
						scoreChange: event.scoreChange,
						correct: event.correct,
						playerAnswer: event.yourAnswer,
						leaderboard: event.leaderboard.map((entry: any) => ({
							name: entry.name,
							score: entry.score,
							positionChange: 0,
							isSelf: entry.name == username,
						})),
						totalQuestions: event.totalQuestions,
					});
					setUsername(event.username);
					setScore(event.score);
					setTotalPlayers(event.totalPlayers);
					break;

				case 'playerAction':
					setCurrentPlayers(
						new Map([
							...currentPlayers.entries(),
							...Object.entries(event.players as Record<string, string>),
						])
					);
					break;

				case 'playerResults':
					setGame({
						stage: Stage.PostGamePlayer,
						leaderboard: event.leaderboard,
						numCorrect: event.numCorrect,
						numWrong: event.numWrong,
					});
					setUsername(event.username);
					setScore(event.score);
					break;

				case 'hostResults':
					setGame({
						stage: Stage.PostGameHost,
						leaderboard: event.leaderboard,
						players: event.players,
					});
					break;
			}
		},

		onError(error) {
			console.error(error);
			setConnected(false);
			setError('The connection was interrupted');
		},

		onClose(reason) {
			setConnected(false);
			if (typeof reason == 'string') {
				setError(`The server closed the connection: ${reason}`);
			} else {
				setError('The connection was interrupted');
			}
		},
	});

	return { connected, error, game };
}
