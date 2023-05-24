import { WebSocket } from 'ws';
import { gen } from './code';

import { sendMessage } from './connection';
import { QuizQuestion } from './quiz';
import { EndData, EndResp, LeaderBoard, socketData } from './respTypes';

// // for clarity, a gameID is just a string
export type UserId = string;

export class User {
	name: string;
	id: UserId
	scores: AnswerObj[] = [];
	connection: WebSocket | undefined = undefined;
	constructor(used:UserId[], name: string){
		this.id = gen(8, used);
		this.name = name;
	}
	totalScore():number{
		let scores = this.scores.map((s:AnswerObj)=>s.score)
		return scores.reduce((a, b)=>a+b);
	}
	getCorrect():number[]{
		return this.scores.reduce((indices, ans, i) => {
			if (ans.correct) indices.push(i);
			return indices;
		}, new Array<number>());
		
	}
	answer(qn: number, time:number, choice:number){
		this.scores[qn].time = time
		this.scores[qn].answer = choice
	}
	scorePlayer(qn:number, data:QuizQuestion) {
		const correct = data.correctAnswers
		this.scores[qn].scoreQuestion(correct);
	}
	initScore(qn:number,qPoints:number, qTime:number) {
		this.scores[qn] = new AnswerObj(qPoints, qTime);
	}
	getLeaderboardComponent():LeaderBoard{
		return {name: this.name,
			 score: this.totalScore(),
			 correctAnswers: this.getCorrect(),
			}
	}
	getEndData(leaderBoard:LeaderBoard[], qn: number):EndData{
		return new EndData({
			correctAnswers: this.getCorrect(),
			score:this.totalScore(),
			scoreChange: this.scores[qn].score,
			correct: this.scores[qn].correct,
			time:this.scores[qn].time,
			leaderboard:leaderBoard,
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
	send(message: socketData){
		if (!this.connection) throw new Error('user not connected');

		if (this.connection.readyState === WebSocket.OPEN) {
			sendMessage(this.connection, message.name, message.data);
		}
		return;
	}
}

