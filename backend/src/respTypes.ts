import { GameId } from './game';
import { UserId } from './user';

export abstract class socketData {
	name!: string;
	data!: responseData;
}

export type responseData =
	| string
	| startResp
	| EndResp
	| ActionResp
	| PlayerResp
	| HostResp
	| LeaderBoard[];

export class closeConnection implements socketData {
	name = 'end';
	data: string;
	constructor(data: string) {
		this.data = data;
	}
}

export class EndData implements socketData {
	name = 'endQuestion';
	data: EndResp;
	constructor(data: EndResp) {
		this.data = data;
	}
}

export class BeginData implements socketData {
	name = 'startQuestion';
	data: startResp;
	constructor(data: startResp) {
		this.data = data;
	}
}

export class ActionData implements socketData {
	name = 'playerAction';
	data: ActionResp;
	constructor(data: ActionResp) {
		this.data = data;
	}
}

export class PlayerRespData implements socketData {
	name = 'playerResults';
	data: {
		leaderboard: LeaderBoard[];
		username: string;
		score: number;
		numCorrect: number;
		numWrong: number;
	};
	constructor(data: PlayerResp) {
		this.data = data;
	}
}

export class HostRespData implements socketData {
	name = 'hostResults';
	data: {
		leaderboard: LeaderBoard[];
		players: PlayerResults[];
	};

	constructor(data: HostResp) {
		this.data = data;
	}
}

export class LeaderboardData implements socketData {
	name = 'results';
	data: LeaderBoard[];
	constructor(data: LeaderBoard[]) {
		this.data = data;
	}
}

// HTTP responses:

export type newGameResp = {
	gameId: GameId;
	hostId: UserId;
	token: String;
};

// export type createResp = {
//     id: number
//     index: number
// }

// Socket data fields:

export type startResp = {
	questionText: string; // question.questionText,
	answerTexts: string[]; // question.answerTexts,
	time: number; // game.timer.endTimestamp - Date.now(),
	index: number; // game.activeQuestion,
	score: number;
	username: string;
	totalQuestions: number;
	totalPlayers: number;
};

export type EndResp = {
	correctAnswers: Array<number>;
	score: number;
	scoreChange: number;
	correct: boolean;
	leaderboard: LeaderBoard[];
	responseTime: number;

	questionText: string; // question.questionText,
	answerTexts: string[]; // question.answerTexts,
	index: number; // game.activeQuestion,
	username: string;
	explanations: string[] | null;
	yourAnswer: number;
	totalQuestions: number;
	totalPlayers: number;
	numAnswered: number[];
};

export type ActionResp = { players: object };

export type PlayerResp = {
	leaderboard: LeaderBoard[];
	numCorrect: number;
	numWrong: number;
	username: string;
	score: number;
};

export type HostResp = {
	leaderboard: LeaderBoard[];
	players: PlayerResults[];
};

export type LeaderBoard = {
	name: string;
	score: number;
	positionChange: number;
	isSelf: boolean;
};

export type PlayerResults = {
	username: string;
	score: number;
	numCorrect: number;
	numWrong: number;
};
