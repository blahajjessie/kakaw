import { WebSocket } from 'ws';
import { gen } from './code';

import { sendMessage } from './connection';
import { Quiz, QuizQuestion } from './quiz';
import { EndData, LeaderBoard, socketData, startResp } from './respTypes';
import { AnswerObj } from './answer';

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
	getCorrect(): number[] {
		return this.answers.reduce((indices, ans, i) => {
			if (ans.correct) indices.push(i);
			return indices;
		}, new Array<number>());
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
	getLeaderboardComponent(): LeaderBoard {
		return {
			name: this.name,
			score: this.totalScore(),
			correctAnswers: this.getCorrect(),
		};
	}
	getStartData(qn: number, quiz: Quiz): startResp {
		const question = quiz.getQuestionData(qn);
		return {
			questionText: question.questionText,
			answerTexts: question.answerTexts,
			time: quiz.getQuestionTime(qn),
			index: qn,
			username: this.name,
			score: this.totalScore(),
			totalQuestions: quiz.getQuestionCount(),
		};
	}
	getEndData(
		leaderBoard: LeaderBoard[],
		qn: number,
		question: QuizQuestion,
		totalQuestions: number
	): EndData {
		// calculate position change
		const playerPosition = leaderBoard.findIndex(
			(entry) => entry.name === this.name
		);
		const positionChange = NaN;
		if (this.previousPosition > -1) {
			const positionChange = this.previousPosition - playerPosition;
		}
		this.previousPosition = playerPosition;
		return new EndData({
			correctAnswers: question.correctAnswers,
			explanations: question.explanations || null,
			score: this.totalScore(),
			scoreChange: this.answers[qn].score,
			correct: this.answers[qn].correct,
			leaderboard: leaderBoard,
			positionChange: positionChange,
			responseTime: this.answers[qn].time,
			questionText: question.questionText,
			answerTexts: question.answerTexts,
			index: qn,
			username: this.name,
			yourAnswer: this.answers[qn].answer,
			totalQuestions: totalQuestions,
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
	send(message: socketData) {
		if (!this.connection) throw new Error('user not connected');

		if (this.connection.readyState === WebSocket.OPEN) {
			sendMessage(this.connection, message.name, message.data);
		}
		return;
	}
}
