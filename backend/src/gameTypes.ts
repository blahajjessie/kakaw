import { WebSocket } from 'ws';

// // for clarity, a gameID is just a string
export type UserId = string;
// // used ids for both players and host
export type GameId = string;

export interface User {
	name: string;
	connection: WebSocket | undefined;
}
const invalidUser = { name: 'invalid', connection: undefined };
// // define a quiz and question type
export interface QuizQuestion {
	questionText: string;
	answerTexts: string[];
	correctAnswers: number[];
	note?: string;
	time?: number;
	points?: number;
}

interface Quiz {
	meta: {
		title: string;
		author: string;
		pointDefault: number;
		timeDefault: number;
		note?: string;
	};
	questions: QuizQuestion[];
}

class AnswerObj {
	time = -1;
	answer = -1;
	correct = false;
	score = 0;
	constructor(time?: number, answer?: number) {
		if (time) this.time = time;
		if (answer) this.answer = answer;
	}
	scoreQuestion(answerArray: Array<number>): void {
		if (answerArray.includes(this.answer)) {
			this.correct = true;
			this.score = 100;
		}
		return;
	}
}

export type EndResp = {
	correct: boolean;
	correctAnswers: Array<number>;
	score: number;
	scoreChange: number;
	time: number;
};

function quizValidate(q: Quiz): Quiz {
	// TODO:: Throw an error on invalid quizzes
	// if the quiz is invalid, its caught by the post request (goofy) and sent up
	if (!q) throw new Error('Invalid Quiz!');
	return q;
}

export class Game {
	hostId: UserId;
	quizData: Quiz;
	users = new Map<UserId, User>();
	userAnswers = new Map<UserId, Array<AnswerObj>>();
	quizOpen = false;
	activeQuestion = -1;

	constructor(hostId: UserId, quiz: Quiz) {
		this.hostId = hostId;
		// silly goofy code.
		// QuizValidate returns the quiz right back, but will throw an error if its not valid
		this.quizData = quizValidate(quiz);
	}

	getQuestionData(): QuizQuestion {
		return this.quizData.questions[this.activeQuestion];
	}
	getQuestionNumber(qn: number) {}
	scorePlayer(userId: UserId): void {
		const correct = this.getQuestionData().correctAnswers;
		let ans = this.userAnswers.get(userId);
		if (!ans) ans = new Array();
		let y = (ans[this.activeQuestion] =
			ans[this.activeQuestion] || new AnswerObj());
		ans[this.activeQuestion].scoreQuestion(correct);
	}
	getUsers() {
		return [...this.users.keys(), this.hostId];
	}
	getPlayers() {
		return [...this.users.keys()];
	}
	getUser(id: UserId): User {
		return this.users.get(id) || invalidUser;
	}
	addScore(user: UserId): EndResp {
		this.scorePlayer(user);
		const out: EndResp = {
			correct: false,
			score: 0,
			time: 0,
			correctAnswers: [],
			scoreChange: 0,
		};
		return out;
	}
	// Set Player's score to an empty score object (mostly so we dont have to export the answer type)
	initScore(playerId: UserId): AnswerObj {
		const correct = this.getQuestionData().correctAnswers;
		// create it if it doesnt exist.. its fine
		let ansArr = this.userAnswers.get(playerId) || new Array();
		let ans = ansArr[this.activeQuestion] || new AnswerObj();

		return ans;
	}
	addWs(playerId: UserId, sock: WebSocket) {
		this.getUser(playerId).connection = sock;
	}
	removeWs(playerId:UserId){
		this.getUser(playerId).connection = undefined;
	}
	getWs(playerId:UserId){
		return this.getUser(playerId).connection;
	}
	getQuizName() {
		return this.quizData.meta.title;
	}
}

// // interface for user, mostly blank rn but will keep score or smth later.
// // Userid is stored in the map for now
