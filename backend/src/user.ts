import { WebSocket } from 'ws';
import { gen } from './code';

import { sendMessage } from './connection';
import { Quiz, QuizQuestion } from './quiz';
import { startResp, EndData, EndResp, LeaderBoard, socketData } from './respTypes';
import { AnswerObj } from './answer';

// // for clarity, a gameID is just a string
export type UserId = string;

export class User {
	name: string;
	id: UserId;
	scores: Array<AnswerObj> = new Array<AnswerObj>();
	connection: WebSocket | undefined = undefined;
	constructor(used: UserId[], name: string) {
		this.id = gen(8, used);
		this.name = name;
	}
	totalScore(): number {
		let scores = this.scores.map((s: AnswerObj) => s.score);
		return scores.reduce((a, b) => a + b);
	}
	getCorrect(): number[] {
		return this.scores.reduce((indices, ans, i) => {
			if (ans.correct) indices.push(i);
			return indices;
		}, new Array<number>());
	}
	answer(qn: number, time: number, choice: number) {
		this.scores[qn].time = time;
		this.scores[qn].answer = choice;
	}
	scorePlayer(qn: number, data: QuizQuestion) {
		const correct = data.correctAnswers;
		this.scores[qn].scoreQuestion(correct);
	}
	initScore(qn: number, qPoints: number, qTime: number) {
		this.scores[qn] = new AnswerObj(qPoints, qTime, 0, 0);
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
			score: quiz.getPoints(qn)
		};
	}
	getEndData(leaderBoard: LeaderBoard[], qn: number, quiz: Quiz): EndData {
		const question = quiz.getQuestionData(qn);

		return new EndData({
			correctAnswers: this.getCorrect(),
			score: this.totalScore(),
			scoreChange: this.scores[qn].score,
			correct: this.scores[qn].correct,
			responseTime: this.scores[qn].time * 1000,
			leaderboard: leaderBoard,
			questionText: question.questionText,
			answerTexts: question.answerTexts,
			index: qn,
			username: this.name
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
