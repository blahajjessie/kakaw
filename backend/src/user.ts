import { WebSocket } from 'ws';
import { gen } from './code';

import { sendMessage, killConnection } from './connection';
import { Quiz, QuizQuestion } from './quiz';
import {
	EndData,
	LeaderBoard,
	socketData,
	startResp,
	PlayerResults,
} from './respTypes';
import { AnswerObj } from './answer';
import { prefs } from './preferences';

// // for clarity, a gameID is just a string
export type UserId = string;

export class User {
	name: string;
	id: UserId;
	answers: Array<AnswerObj> = new Array<AnswerObj>();
	connection: WebSocket | undefined = undefined;
	previousPosition: number = -1;
	constructor(used: UserId[], name: string) {
		this.id = gen(8, used);
		this.name = name;
	}
	totalScore(): number {
		let scores = this.answers.map((s: AnswerObj) => s.score);
		return scores.reduce((a, b) => a + b);
	}
	getCorrect(): number {
		return this.answers.reduce((count, ans) => {
			if (ans.correct) count++;
			return count;
		}, 0);
	}
	getIncorrect(): number {
		return this.answers.reduce((count, ans) => {
			if (!ans.correct) count++;
			return count;
		}, 0);
	}
	answer(qn: number, time: number, choice: number) {
		this.answers[qn].time = time;
		this.answers[qn].answer = choice;
	}
	scorePlayer(qn: number, data: QuizQuestion) {
		const correct = data.correctAnswers;
		this.answers[qn].scoreQuestion(correct);
	}
	initScore(qn: number, qPoints: number, qTime: number) {
		this.answers[qn] = new AnswerObj(qPoints, qTime, 0, 0);
	}
	getPlayerResultsComponent(): PlayerResults {
		return {
			username: this.name,
			score: this.totalScore(),
			numCorrect: this.getCorrect(),
			numWrong: this.getIncorrect(),
		};
	}
	getLeaderboardComponent(): LeaderBoard {
		return {
			name: this.name,
			score: this.totalScore(),
			positionChange: 0,
			isSelf: false,
		};
	}
	getStartData(qn: number, quiz: Quiz, tp: number): startResp {
		const question = quiz.getQuestionData(qn);
		return {
			questionText: question.questionText,
			answerTexts: question.answerTexts,
			time: quiz.getQuestionTime(qn),
			index: qn,
			username: this.name,
			score: this.totalScore(),
			totalQuestions: quiz.getQuestionCount(),
			totalPlayers: tp,
		};
	}
	getEndData(
		leaderBoard: LeaderBoard[],
		qn: number,
		question: QuizQuestion,
		totalQuestions: number,
		totalPlayers: number
	): EndData {
		return new EndData({
			correctAnswers: question.correctAnswers,
			explanations: question.explanations || null,
			score: this.totalScore(),
			scoreChange: this.answers[qn].score,
			correct: this.answers[qn].correct,
			leaderboard: leaderBoard.map((entry) => {
				if (entry.name === this.name) {
					return { ...entry, isSelf: true };
				} else {
					return { ...entry, isSelf: false };
				}
			}),
			responseTime: this.answers[qn].time,
			questionText: question.questionText,
			answerTexts: question.answerTexts,
			index: qn,
			username: this.name,
			yourAnswer: this.answers[qn].answer,
			totalQuestions: totalQuestions,
			totalPlayers: totalPlayers,
		});
	}
	addWs(sock: WebSocket) {
		this.connection = sock;
	}
	removeWs() {
		this.connection = undefined;
	}
	getWs(): WebSocket | undefined {
		if (!this.connection) {
			return undefined;
		}
		return this.connection;
	}
	kick(reason: string) {
		if (this.connection) {
			killConnection(
				this.connection,
				'you have been removed from the game because' + reason
			);
		}
		return;
	}
	send(message: socketData) {
		if (!this.connection) {
			if (prefs.debug)
			console.log('user not connected' + this.name);
			return;
		}
		if (this.connection.readyState === WebSocket.OPEN) {
			sendMessage(this.connection, message.name, message.data);
		}
		return;
	}
}
