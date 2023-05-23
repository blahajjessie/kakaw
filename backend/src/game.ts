
import { Quiz } from './quiz';
import { endResp } from './respTypes';
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

export function gameExist(gameId: GameId){
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
	users = new Map<UserId, User>();
	userAnswers = new Map<UserId, Array<AnswerObj>>();
	quizOpen = false;
	activeQuestion = -1;
	timer: Timer = { beginTimestamp: -1, endTimestamp: -1, timeLimit: -1 };

	constructor( quiz: Quiz) {
		this.id = gen(5, [...games.keys()])
		this.quizData = quiz;
		this.hostId = gen(8, []);
		quiz.quizValidate();
		this.host = { name: this.quizData.meta.author, connection: undefined };
		// silly goofy code.
		// QuizValidate returns the quiz right back, but will throw an error if its not valid

	}

	endQuestion(gameId: GameId) {
		const game = games.get(gameId);
		if (!game) return;
		const users = game.getUsers();
	
		let qAns = game.quizData.questions[game.activeQuestion].correctAnswers;
		let leaderboard: { name: string; score: number }[] = [];
		users.forEach(function (playerId: UserId) {
			// host isn't participating
			if (playerId == game.hostId) return;
			let resp = game.addScore(playerId);
			let playerSocket = game.getUser(playerId).getWs();
			if (playerSocket === undefined) {
				return;
			}

			leaderboard.push({ name: game.getUser(playerId).name, score: resp.score });
		});
	
		// host view
		leaderboard.sort((a, b) => b.score - a.score);
		let hostResp = {
			correctAnswers: qAns,
			leaderBoard: leaderboard,
		};
		const hostId = game.hostId;
		const hostSocket = game.getWs(hostId);
		if (hostSocket !== undefined && hostSocket.readyState === WebSocket.OPEN) {
			sendMessage(hostSocket, 'endQuestion', hostResp);
		}
	
		game.resetTimer();
		return;
	}
	
	// Input: Game Object
	// beginQuestion sends each player and host the current active question
	beginQuestion(gameId: GameId) {
		const game = games.get(gameId);
		if (!game) return;
		const users = game.getUsers();
	
		// TODO: only send question data (dont send answers, etc)
		const question = game.getQuestionData();
		if (!question) {
			// TODO: send error
			return;
		}
	
		// remaining time should be timeLimit unless a new player has joined
		if (game.timer.beginTimestamp == -1) {
			// check if questionTime is valid, else timeLimit is default time
			const questionOptionalTime = question.time;
			if (
				typeof questionOptionalTime !== 'undefined' &&
				!isNaN(questionOptionalTime)
			) {
				game.timer.timeLimit = questionOptionalTime * 1000;
			} else {
				game.timer.timeLimit = game.quizData.meta.timeDefault * 1000;
			}
			game.timer.beginTimestamp == Date.now();
			game.timer.endTimestamp == Date.now() + game.timer.timeLimit;
		}
	
	
		users.forEach(function (playerId: UserId) {
			let sock = game.getWs(playerId);
			if (sock === undefined) {
				return;
			}
			console.log(sock.readyState);
			if (sock.readyState === WebSocket.OPEN) {
				sendMessage(sock, 'startQuestion', beginResp);
			}
			game.initScore(playerId);
		});
		game.runTimer(beginResp.time);
		return;
	}

	scorePlayer(userId: UserId): void {
		const correct = this.quizData.getAnswers(this.activeQuestion);
		let ans = this.userAnswers.get(userId);
		if (!ans) ans = new Array();
		let y = (ans[this.activeQuestion] =
			ans[this.activeQuestion] || new AnswerObj());
		ans[this.activeQuestion].scoreQuestion(correct);
	}
	getUserNames(): String[] {
		const users = [...this.users.values()];
		const names: String[] = users.map((usr) => usr.name, []);
		return names;
	}
	getUsers() {
		return [...this.users.keys(), this.hostId];
	}
	getPlayers() {
		return [...this.users.keys()];
	}
	getUser(id: UserId):User {
		if (id == this.hostId) return this.host;
		if (!this.users.get(id)) throw new Error('Invalid user');
		return this.users.get(id)!;
	}
	addPlayer(id: UserId, username: string) {
		this.users.set(id, {
			name: username,
			connection: undefined,
		});
	}
	addScore(user: UserId): endResp {
		this.scorePlayer(user);
		const out: endResp = {
			correct: false,
			score: 0,
			time: 0,
			correctAnswers: [],
			scoreChange: 0,
		};
		return out;
	}
	private getPlayerScoreArray(player:UserId){
		let userAnswers = this.userAnswers.get(player);

	}
	getLeaderboard() {
		let results: {
			name: string;
			score: number;
			correctAnswers: number[];
		}[] = new Array();

		this.getPlayers().forEach((player) => {
			let userAnswers = this.userAnswers.get(player);
			let score: number = userAnswers
				? userAnswers.reduce((a, b) => b.score + a, 0)
				: 0;

			// indices of questions answered correctly
			let correctAnswers = userAnswers?.reduce((indices, ans, i) => {
				if (ans.correct) indices.push(i);
				return indices;
			}, new Array<number>());
			correctAnswers = correctAnswers ? correctAnswers : [];
			results.push({
				name: this.users.get(player)!.name,
				score: score,
				correctAnswers: correctAnswers,
			});
		});
		results.sort((a, b) => b.score - a.score);
		return results;
	}
	// Set Player's score to an empty score object (mostly so we dont have to export the answer type)
	initScore(playerId: UserId): AnswerObj {
		const correct = this.quizData.getAnswers(this.activeQuestion);
		// create it if it doesnt exist.. its fine
		let ansArr = this.userAnswers.get(playerId) || new Array();
		let ans = ansArr[this.activeQuestion] || new AnswerObj();

		return ans;
	}
	answer(playerId: UserId, time: number, answer: number) {

	}
	async runTimer(ms: number) {
		console.log('Starting timer');
		await waitTimer(ms); // Wait for 5 seconds
		console.log('Ending timer');
	}
	resetTimer() {
		this.timer.beginTimestamp = -1;
		this.timer.endTimestamp = -1;
		this.timer.timeLimit = -1;
	}


}

// // interface for user, mostly blank rn but will keep score or smth later.
// // Userid is stored in the map for now
