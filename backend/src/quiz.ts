import { BeginData, startResp } from './respTypes';

export interface QuizQuestion {
	questionText: string;
	answerTexts: string[];
	correctAnswers: number[];
	note?: string;
	time?: number;
	points?: number;
	explanations?: string[];
}

export interface QuizMeta {
	title: string;
	author: string;
	pointDefault: number;
	timeDefault: number;
	note?: string;
}

function quizValidate(quiz: any) {
	// validate that meta and questions are the only objects
	const quizKeys = ['meta', 'questions'];
	const quizInvalidKeys = Object.keys(quiz).filter(
		(key) => !quizKeys.includes(key)
	);
	if (quizInvalidKeys.length > 0) {
		throw new Error(
			`Invalid keys found in Quiz object: ${quizInvalidKeys.join(', ')}`
		);
	}

	// validate expected keys in meta object
	const metaKeys = ['title', 'author', 'pointDefault', 'timeDefault', 'note'];
	const metaInvalidKeys = Object.keys(quiz.meta).filter(
		(key) => !metaKeys.includes(key)
	);
	if (metaInvalidKeys.length > 0) {
		throw new Error(
			`Invalid keys found in Quiz meta object: ${metaInvalidKeys.join(', ')}`
		);
	}

	// validate meta object
	if (
		!quiz.meta ||
		typeof quiz.meta !== 'object' ||
		typeof quiz.meta.title !== 'string' ||
		typeof quiz.meta.author !== 'string' ||
		typeof quiz.meta.pointDefault !== 'number' ||
		typeof quiz.meta.timeDefault !== 'number'
	) {
		throw new Error('Invalid Quiz meta object');
	}

	if (quiz.meta.title.length < 1 || quiz.meta.title.length > 100) {
		throw new Error(`Invalid Quiz title length`);
	}
	if (quiz.meta.author.length < 1 || quiz.meta.author.length > 100) {
		throw new Error(`Invalid Quiz author length`);
	}
	if (quiz.meta.pointDefault < 1 || quiz.meta.pointDefault > 1000) {
		throw new Error(`Invalid Quiz pointDefault`);
	}
	if (quiz.meta.timeDefault < 1 || quiz.meta.timeDefault > 420) {
		throw new Error(`Invalid Quiz timeDefault`);
	}

	// validate questions array
	if (!Array.isArray(quiz.questions)) {
		throw new Error('Quiz questions must be an array');
	}
	const qArrLen = quiz.questions.length;
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
		'explanations',
	];
	for (let qIndex = 0; qIndex < qArrLen; qIndex++) {
		const question = quiz.questions[qIndex];

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
		if (question.explanations) {
			if (!(question.explanations instanceof Array<string>)) {
				throw new Error(
					`Answer choice for ${qIndex} must be an array of strings`
				);
			}
			if (question.explanations.length != question.answerTexts.length) {
				throw new Error(
					`Number of explanations must match the number of answer choices ${qIndex}`
				);
			}
			question.explanations.forEach((element: string) => {
				if (!element) {
					throw new Error(`Explanation must exist ${qIndex}`);
				}
			});
		}
	}
}

export class Quiz {
	meta: QuizMeta;
	questions: QuizQuestion[];

	constructor(body: any) {
		quizValidate(body);
		// console.log(body)
		this.meta = body.meta;
		this.questions = body.questions;
	}

	getName() {
		return this.meta.title;
	}

	getQuestionData(qn: number): QuizQuestion {
		return this.questions[qn];
	}
	getAnswers(qn: number) {
		return this.questions[qn].correctAnswers;
	}
	getAnswerChoices(qn: number) {
		return this.questions[qn].answerTexts;
	}
	getQuestionTime(qn: number): number {
		return (this.questions[qn].time || this.meta.timeDefault) * 1000 ;
	}
	getPoints(qn: number): number {
		return this.questions[qn].points || this.meta.pointDefault;
	}
}
