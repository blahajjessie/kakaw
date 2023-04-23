import { Express } from 'express';
import * as code from './code';
import * as user from './user';

// for clarity, a gameID is just a string
type UserId = string;
// used ids for both players and host
type GameId = string;

// interface for user, mostly blank rn but will keep score or smth later.
// Userid is stored in the map for now
export interface User {
	name: string;
}
const usedGame: GameId[] = [];

// define a quiz and question type
export interface QuizQuestion {
	questionText: string;
	answerTexts: string[];
	correctAnswers: number[];
	note?: string;
	time?: number;
	points?: number;
}

export interface Quiz {
	meta: {
		title: string;
		author: string;
		pointDefault: number;
		timeDefault: number;
		note?: string;
	};
	questions: QuizQuestion[];
}

export interface Game {
	users: Map<UserId, User>;
	hostId: UserId;
	activeQuestion: number;
	quizData: Quiz;
}

function getUsers(game: Game) {
	return [...(game.users.keys(), game.hostId)];
}
// first key is gameId
const games: Map<GameId, Game> = new Map();
let open = -1;

export default function registerGameRoutes(app: Express) {
	app.post('/games', (req, res) => {
		try {
			const quizData: Quiz = JSON.parse(req.body);
			const response = {
				gameId: code.gen(5, []),
				hostId: code.gen(8, []),
			};
			// associate gameId with data and host
			const data = {
				users: new Map(),
				quizData,
				hostId: response.hostId,
				activeQuestion: -1,
			};
			games.set(response.gameId, data);
			res.send(response);
		} catch (e) {
			// client error
			console.error('Invalid JSON file:', e);
			res.status(400).send('Invalid JSON file');
			// Todo: further validation
		}
	});

	app.get('/games/:gameId/questions/:index/start', (req, res) => {
		const gameId: GameId = req.params.gameId;
		// const hostId = req.query.hostId as string;
		const index = parseInt(req.params.index);
		const game = games.get(gameId);

		// client-requested game error
		if (game === undefined) {
			res.status(404).send(`Game ${gameId} not found`);
			return;
		}

		// we have no way of validating the host yet

		// const host = game.hostid;
		// // client permission error
		// if (host !== hostId) {
		// 	res.status(403).send(`Incorrect host of game ${gameId}`);
		// 	return;
		// }

		const quiz = game.quizData;
		// out-of-bounds error
		if (index >= quiz.questions.length) {
			res.status(404).send(`Question ${index} not found`);
			return;
		}

		// start accepting answers for the question index
		game.activeQuestion = index;

		// show question text and answers on both host and player screens?

		beginQuestion();

		res.send({ ok: true });
	});

	app.post('/games/:gameId/questions/:index/answer', (req, res) => {
		const gameId: GameId = req.params.gameId;
		const userId: UserId = req.body.playerId;
		const index = parseInt(req.params.index);
		const game = games.get(gameId);
		try {
			const answer: number = parseInt(req.body.answer);
		} catch (e) {
			const answer = -1;
		}
		// client-requested game error
		if (game === undefined) {
			res.status(404).send(`Game ${gameId} not found`);
			return;
		}

		const quiz = game.quizData;
		const question = quiz.questions[index];

		// check if question is open
		if (game.activeQuestion != index) {
			res.status(400).send(`Question ${index} is not open for answers`);
			return;
		}

		// add map w/ player ids and answers?

		// not accepting answers for the question index from the playerId
	});

	app.post('/games/:gameId/players', (req, res) => {
		const body = req.body;
		const gameId: GameId = req.params.gameId;

		if (!body.username) {
			res.status(400).send();
			return;
		}

		const game = games.get(gameId);

		if (game === undefined) {
			res.status(404).send();
			return;
		}

		// let playerSet = games.get(gameId);

		// if (playerSet === undefined) {
		// 	playerSet = new Map();
		// 	games.set(gameId, playerSet);
		// }

		const username: UserId = body.username;
		if (game.users.has(username)) {
			res.status(409).send();
			return;
		}

		// Functionally done to make use of code generation
		// but I don't want to store the id's more than they already are (twice now)

		const id = code.gen(8, [...(game.users.keys(), game.hostId)]);

		game.users.set(id, { name: username });
		const r = { id: id };
		res.status(201).json(r).send();
		return;
	});
}

function beginQuestion() {}
