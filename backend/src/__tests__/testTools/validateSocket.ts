export function validate(message: any) {
	expect(message).toBeDefined();
	expect(message.type).toBeDefined();
	switch (message.type) {
		case 'startQuestion': {
			expect(message.questionText).toBeDefined();
			expect(message.answerTexts).toBeDefined();
			expect(message.time).toBeDefined();
			expect(message.index).toBeDefined();
			expect(message.username).toBeDefined();
			expect(message.score).toBeDefined();
			break;
		}
		case 'endQuestion': {
			expect(message.correctAnswers).toBeDefined();
			expect(message.explanations).toBeDefined();
			expect(message.score).toBeDefined();
			expect(message.scoreChange).toBeDefined();
			expect(message.correct).toBeDefined();
			expect(message.responseTime).toBeDefined();
			expect(message.questionText).toBeDefined();
			expect(message.answerTexts).toBeDefined();
			expect(message.index).toBeDefined();
			expect(message.username).toBeDefined();
			expect(message.yourAnswer).toBeDefined();
			expect(message.leaderboard).toBeDefined();
			break;
		}
		case 'results': {
			expect(message.playerResults).toBeDefined();
			break;
		}
		case 'player': {
			expect(message.data.leaderboard).toBeDefined();
			expect(message.data.username).toBeDefined();
			expect(message.data.score).toBeDefined();
			expect(message.data.numCorrect).toBeDefined();
			expect(message.data.numWrong).toBeDefined();
			break;
		}
		case 'playerResults': {
			// expect(message.data.leaderboard).toBeDefined();
			// expect(message.data.players).toBeDefined();
			break;
		}
		default:
			expect(message.type).toStrictEqual('Check Type');
			break;
	}
	return;
}
