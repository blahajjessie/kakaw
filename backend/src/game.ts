import { Quiz, QuizQuestion } from './quiz';
import {
	BeginData,
	startResp,
	LeaderBoard,
	LeaderboardData,
	ActionData,
} from './respTypes';
import { gen } from './code';
import { UserId, User } from './user';

// // used ids for both players and host
export type GameId = string;

const games: Map<GameId, Game> = new Map();

export function getGame(gameId: GameId): Game {
	let out = games.get(gameId);
	if (!out) throw new Error('Game does not exist');
	return out;
}

export function gameExist(gameId: GameId) {
	return !!games.get(gameId);
}

// // define a quiz and question type

export function waitTimer(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

type Timer = {
	beginTimestamp: number;
	endTimestamp: number;
	timeLimit: number;
};

export class Game {
	id: GameId;
	hostId: UserId;
	host: User;
	quizData: Quiz;
	players = new Map<UserId, User>();
	quizOpen = false;
	activeQuestion = -1;
	startTime = -1;
	timer: NodeJS.Timeout | undefined = undefined;

	constructor(quiz: any) {
		this.id = gen(5, [...games.keys()]);
		this.quizData = new Quiz(quiz);
		this.hostId = gen(8, []);
		this.host = new User([], this.quizData.meta.author);
		games.set(this.id, this);
	}

	endQuestion() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = undefined;
		}
		const qn = this.activeQuestion;
		const qd = this.getQuestionData();
		const board = this.getLeaderboard();
		this.players.forEach((u) => {
			u.send(u.getEndData(board, this.activeQuestion, qd));
		});
		this.host.send(this.host.getEndData(board, this.activeQuestion, qd));
		this.quizOpen = false;

		return;
	}
	getQuestionData() {
		return this.quizData.getQuestionData(this.activeQuestion);
	}

	sendPlayerAction(uid: UserId){
		const user = this.getUser(uid);
		if (!user) throw new Error("User issue");
		const respObj = {
			uid: user.name
		}
		this.host.send(new ActionData(respObj))
	}
	// Input: Game Object
	// beginQuestion sends each player and host the current active question
	beginQuestion() {
		let question: startResp;
		let pts: number;

		this.activeQuestion++;
		console.log(this.activeQuestion);
		const qn = this.activeQuestion;
		const qt = this.quizData.getQuestionTime(qn);
		pts = this.quizData.getPoints(this.activeQuestion);

		this.getUsers().forEach((p: User) => {
			p.initScore(this.activeQuestion, pts, qt);
			const message = new BeginData(
				p.getStartData(this.activeQuestion, this.quizData)
			);
			p.send(message);
		});
		this.quizOpen = true;

		this.timer = setTimeout(() => this.endQuestion(), qt);
		this.startTime = Date.now();

		return;
	}

	getUsers() {
		return [...this.players.values(), this.host];
	}
	getPlayers() {
		return [...this.players.values()];
	}
	getUser(id: UserId): User {
		console.log(id);
		if (id == this.hostId) return this.host;
		if (!this.players.get(id)) throw new Error('Invalid user');
		return this.players.get(id)!;
	}
	iterateUsers(f: (u: User) => any): Array<any> {
		return this.getUsers().map(f);
	}

	addPlayer(username: string): UserId {
		// check if the username is taken
		let names = this.iterateUsers((u) => u.name);
		if (names.includes(username)) throw new Error('Username is taken');
		// add a new user
		let u = new User(
			this.iterateUsers((u: User) => u.id),
			username
		);
		console.log(u.id);
		this.players.set(u.id, u);
		return u.id;
	}

	getLeaderboard(): LeaderBoard[] {
		const qn = this.activeQuestion;
		const qd = this.getQuestionData();

		let leaderboard: LeaderBoard[] = [];
		this.players.forEach(function (player: User) {
			player.scorePlayer(qn, qd);
			leaderboard.push(player.getLeaderboardComponent());
		});
		leaderboard.sort((a, b) => b.score - a.score);
		return leaderboard;
	}
	sendResults() {
		this.host.send(new LeaderboardData(this.getLeaderboard()));
	}
}

// // interface for user, mostly blank rn but will keep score or smth later.
// // Userid is stored in the map for now
