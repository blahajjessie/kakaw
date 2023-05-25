export class AnswerObj {
	totalPoints = 0;
	totalTime = 0;
	time = -1;
	answer = -1;
	correct = false;
	score = 0;
	constructor(
		totalPoints: number,
		totalTime: number,
		time?: number,
		answer?: number
	) {
		this.totalPoints = totalPoints;
		this.totalPoints = totalTime;
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
