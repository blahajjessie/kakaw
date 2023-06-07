import { Quiz, QuizQuestion } from './quiz';
import {
	BeginData,
	startResp,
	LeaderBoard,
	ActionData,
	PlayerResults,
	PlayerRespData,
	HostRespData,
} from './respTypes';
import { gen } from './code';
import { UserId, User } from './user';
import { prefs } from './preferences';
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
	hostTimeout: NodeJS.Timeout | undefined = undefined;
	constructor(quiz: any) {
		this.id = gen(5, [...games.keys()]);
		this.quizData = new Quiz(quiz);
		this.host = new User([], this.quizData.meta.author);
		this.hostId = this.host.id;
		games.set(this.id, this);
	}

	endQuestion() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = undefined;
		}
		const qn = this.activeQuestion;
		const qd = this.getQuestionData();

		this.players.forEach((player: User) => {
			player.scorePlayer(qn, qd);
		});

		const board = this.getLeaderboard();
		const totalQuestions = this.quizData.getQuestionCount();
		this.players.forEach((u) => {
			u.send(u.getEndData(board, this.activeQuestion, qd, totalQuestions));
		});
		this.host.send(
			this.host.getEndData(board, this.activeQuestion, qd, totalQuestions)
		);
		this.quizOpen = false;

		return;
	}
	getQuestionData() {
		return this.quizData.getQuestionData(this.activeQuestion);
	}

	sendPlayerAction(uid: UserId) {
		const user = this.getUser(uid);
		if (!user) throw new Error('User issue');
		const respObj = {
			[uid]: user.name,
		};
		this.host.send(new ActionData({ players: respObj }));
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
		// score question

		// generate new leaderboard
		let leaderboard: LeaderBoard[] = [];
		this.players.forEach(function (player: User) {
			leaderboard.push(player.getLeaderboardComponent());
		});
		leaderboard.sort((a, b) => b.score - a.score);

		// calculate position change for all players
		this.players.forEach(function (player: User) {
			const playerPosition = leaderboard.findIndex(
				(entry) => entry.name === player.name
			);
			let positionChange = NaN;
			if (player.previousPosition > -1) {
				positionChange = player.previousPosition - playerPosition;
			}
			const entry = leaderboard.find((entry) => entry.name === player.name);
			if (entry) {
				entry.positionChange = positionChange;
			}
			player.previousPosition = playerPosition;
		});

		return leaderboard;
	}
	getPlayerResults(): PlayerResults[] {
		let playerResults: PlayerResults[] = [];
		this.players.forEach(function (player: User) {
			playerResults.push(player.getPlayerResultsComponent());
		});
		playerResults.sort((a, b) => b.score - a.score);
		return playerResults;
	}
	sendResults() {
		const leaderboard = this.getLeaderboard();
		const players = this.getPlayerResults();
		const hostData = { leaderboard, players };
		const resultResp = new HostRespData(hostData);
		this.host.send(resultResp);
		this.players.forEach((player: User) => {
			const playerResult = {
				leaderboard: leaderboard,
				numCorrect: player.getCorrect(),
				numWrong: player.getIncorrect(),
				username: player.name,
				score: player.totalScore(),
			};
			player.send(new PlayerRespData(playerResult));
		});
	}
	setHostTimeout() {
		this.hostTimeout = setTimeout(
			() => this.endGame(),
			prefs.hostDisconnectDelay
		);
		console.log(
			'Host disconnected. Waiting ' +
				prefs.hostDisconnectDelay +
				' ms for reconnect, gameId ' +
				this.id
		);
	}
	endHostTimeout() {
		if (!this.hostTimeout) {
			console.log(
				'Host appears to be connected already (or connecting for the first time), gameId ' +
					this.id
			);
			return;
		}
		clearTimeout(this.hostTimeout);
		this.hostTimeout = undefined;
		console.log('Host reconnected');
	}
	kickUser(uid: UserId, reason: string) {
		const u = this.getUser(uid);
		u.kick(reason);
		this.players.delete(uid);
	}
	endGame() {
		console.log(
			'Host has been disconnected too long. Game should end now!, gameId ' +
				this.id
		);
		this.getUsers().forEach((u) => {
			this.kickUser(u.id, 'The game is over');
		});
		games.delete(this.id);
	}
	updateUser(uid: UserId) {
		if (uid == this.hostId) {
			this.updateHost();
			return;
		}
		this.updatePlayer(uid);
	}
	updateHost() {
		this.endHostTimeout();
	}
	updatePlayer(uid: UserId) {
		console.log('Player has received its status update');
	}
}
