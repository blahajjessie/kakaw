export class AnswerObj {
	totalPoints: number;
	totalTime: number;
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
		this.totalTime = totalTime;
		if (time) this.time = time;
		if (answer) this.answer = answer;
	}
	scoreQuestion(answerArray: Array<number>): void {
		this.correct = answerArray.includes(this.answer);
		const isCorrect = this.correct ? 1 : 0;
		if (this.totalPoints == 0 || this.totalTime == 0) {
			this.score = 0;
			return;
		}
		const ratio = this.time / this.totalTime;
		const varPoints = 0.7 * this.totalPoints;
		const setPoints = 0.3 * this.totalPoints;
		this.score = Math.round((varPoints * (1 - ratio) + setPoints) * isCorrect);
		return;
	}
}
