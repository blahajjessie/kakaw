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
	totalPoints = 0;
	totalTime = 0;
	time = -1;
	answer = -1;
	correct = false;
	score = 0;
	constructor(
		totalPoints?: number,
		totalTime?: number,
		time?: number,
		answer?: number
	) {
		if (totalPoints) this.totalPoints = totalPoints;
		if (totalTime) this.totalTime = totalTime;
		if (time) this.time = time;
		if (answer) this.answer = answer;
	}
	scoreQuestion(answerArray: Array<number>): void {
		this.correct = answerArray.includes(this.answer);
		const isCorrect = this.correct ? 1 : 0;
		const ratio = this.time / this.totalTime;
		const varPoints = 0.9 * this.totalPoints;
		const setPoints = 0.1 * this.totalPoints;
		this.score = Math.round((varPoints * (1 - ratio) + setPoints) * isCorrect);
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
	// validate that meta and questions are the only objects
	const quizKeys = ['meta', 'questions'];
	const quizInvalidKeys = Object.keys(q).filter(
		(key) => !quizKeys.includes(key)
	);
	if (quizInvalidKeys.length > 0) {
		throw new Error(
			`Invalid keys found in Quiz object: ${quizInvalidKeys.join(', ')}`
		);
	}

	// validate expected keys in meta object
	const metaKeys = ['title', 'author', 'pointDefault', 'timeDefault', 'note'];
	const metaInvalidKeys = Object.keys(q.meta).filter(
		(key) => !metaKeys.includes(key)
	);
	if (metaInvalidKeys.length > 0) {
		throw new Error(
			`Invalid keys found in Quiz meta object: ${metaInvalidKeys.join(', ')}`
		);
	}

	// validate meta object
	if (
		!q.meta ||
		typeof q.meta !== 'object' ||
		typeof q.meta.title !== 'string' ||
		typeof q.meta.author !== 'string' ||
		typeof q.meta.pointDefault !== 'number' ||
		typeof q.meta.timeDefault !== 'number'
	) {
		throw new Error('Invalid Quiz meta object');
	}

	if (q.meta.title.length < 1 || q.meta.title.length > 100) {
		throw new Error(`Invalid Quiz title length`);
	}
	if (q.meta.author.length < 1 || q.meta.author.length > 100) {
		throw new Error(`Invalid Quiz author length`);
	}
	if (q.meta.pointDefault < 1 || q.meta.pointDefault > 1000) {
		throw new Error(`Invalid Quiz pointDefault`);
	}
	if (q.meta.timeDefault < 1 || q.meta.timeDefault > 420) {
		throw new Error(`Invalid Quiz timeDefault`);
	}

	// validate questions array
	if (!Array.isArray(q.questions)) {
		throw new Error('Quiz questions must be an array');
	}
	const qArrLen = q.questions.length;
	if (qArrLen == 0 || qArrLen > 100) {
		throw new Error(`Invalid Quiz questions array length of ${qArrLen}`);
	}

	const questionKeys = [
		'questionText',
		'answerTexts',
		'correctAnswers',
		'note',
		'time',
		'points',
	];
	for (let qIndex = 0; qIndex < qArrLen; qIndex++) {
		const question = q.questions[qIndex];

		// validate expected keys in each question object
		const questionInvalidKeys = Object.keys(question).filter(
			(key) => !questionKeys.includes(key)
		);
		if (questionInvalidKeys.length > 0) {
			throw new Error(
				`Invalid keys found in Quiz question object at index ${qIndex}: ${questionInvalidKeys.join(
					', '
				)}`
			);
		}

		// validate question
		if (
			!question ||
			typeof question.questionText !== 'string' ||
			!Array.isArray(question.answerTexts) ||
			!Array.isArray(question.correctAnswers)
		) {
			throw new Error(`Invalid Quiz question object at index ${qIndex}`);
		}

		// validate questionText character length
		const qTextLen = question.questionText.length;
		if (qTextLen == 0 || qTextLen > 100) {
			throw new Error(
				`Invalid questionText char length of ${qTextLen} at question index ${qIndex}`
			);
		}

		// validate answerTexts array length
		const ansArrLen = question.answerTexts.length;
		if (ansArrLen < 2 || ansArrLen > 6) {
			throw new Error(
				`Invalid answerText array length of ${ansArrLen} at question index ${qIndex}`
			);
		}

		// validate answerTexts array elements character length
		for (let ansIndex = 0; ansIndex < ansArrLen; ansIndex++) {
			if (typeof question.answerTexts[ansIndex] !== 'string') {
				throw new Error(
					`Invalid type in answerText index ${ansIndex} at question index ${qIndex}`
				);
			}
			const ansTextLen = question.answerTexts[ansIndex].length;
			if (ansTextLen == 0 || ansTextLen > 100) {
				throw new Error(
					`Invalid char length in answerText index ${ansIndex} at question index ${qIndex}`
				);
			}
		}

		// validate correctAnswers array length
		const corrArrLen = question.correctAnswers.length;
		if (corrArrLen < 1 || corrArrLen > ansArrLen) {
			throw new Error(
				`Invalid correctAnswers array length of ${corrArrLen} at question index ${qIndex}`
			);
		}

		// validate correctAnswers set
		const corrAnsSet = new Set(question.correctAnswers);
		if (corrAnsSet.size !== corrArrLen) {
			throw new Error(
				`Duplicate correctAnswers indices at question index ${qIndex}`
			);
		}

		// validate correctAnswer array elements value
		for (let corrIndex = 0; corrIndex < corrArrLen; corrIndex++) {
			if (typeof question.correctAnswers[corrIndex] !== 'number') {
				throw new Error(
					`Invalid type in correctAnswer index ${corrIndex} at question index ${qIndex}`
				);
			}
			const corrAns = question.correctAnswers[corrIndex];
			if (corrAns < 0 || corrAns >= ansArrLen) {
				throw new Error(
					`Invalid value ${corrAns} in correctAnswer index ${corrIndex} at question index ${qIndex}`
				);
			}
		}

		// validate optional time duration and point values
		if (question.time !== undefined) {
			if (isNaN(question.time) || question.time > 420 || question.time < 1) {
				throw new Error(`Invalid time at question index ${qIndex}`);
			}
		}
		if (question.points !== undefined) {
			if (
				isNaN(question.points) ||
				question.points > 10000 ||
				question.points < 1
			) {
				throw new Error(`Invalid points at question index ${qIndex}`);
			}
		}
	}
	return q;
}

export function waitTimer(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

type Timer = {
	beginTimestamp: number;
	endTimestamp: number;
	timeLimit: number;
};

export class Game {
	hostId: UserId;
	host: User;
	quizData: Quiz;
	users = new Map<UserId, User>();
	userAnswers = new Map<UserId, Array<AnswerObj>>();
	quizOpen = false;
	activeQuestion = -1;
	timer: Timer = { beginTimestamp: -1, endTimestamp: -1, timeLimit: -1 };

	constructor(hostId: UserId, quiz: Quiz) {
		this.hostId = hostId;
		this.host = { name: 'HOST', connection: undefined };
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
	getUser(id: UserId): User {
		if (id == this.hostId) return this.host;
		return this.users.get(id) || invalidUser;
	}
	addPlayer(id: UserId, username: string) {
		this.users.set(id, {
			name: username,
			connection: undefined,
		});
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
		const correct = this.getQuestionData().correctAnswers;
		// create it if it doesnt exist.. its fine
		let ansArr = this.userAnswers.get(playerId) || new Array();
		let ans = ansArr[this.activeQuestion] || new AnswerObj();

		return ans;
	}
	answer(playerId: UserId, time: number, answer: number) {
		// if (user.answers[index] !== undefined) {
		// 	res.status(400).send({
		// 		ok: false,
		// 		err: `Answer for Question ${index} already exists`,
		// 	});
		// 	return;
		// } else {
		// 	// if a player has joined late, their previous answers will be undefined
		// 	user.answers[index] = answer;
		// }
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
	addWs(playerId: UserId, sock: WebSocket) {
		if (this.getUser(playerId) == invalidUser) throw new Error('Invalid user');
		this.getUser(playerId).connection = sock;
	}
	removeWs(playerId: UserId) {
		this.getUser(playerId).connection = undefined;
	}
	getWs(playerId: UserId): WebSocket | undefined {
		if (!this.getUser(playerId).connection) {
			return undefined;
			// throw new Error('user not connected');
		}
		return this.getUser(playerId).connection;
	}
	getQuizName() {
		return this.quizData.meta.title;
	}
}

// // interface for user, mostly blank rn but will keep score or smth later.
// // Userid is stored in the map for now
