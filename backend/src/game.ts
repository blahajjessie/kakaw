import { Express } from 'express';
import * as code from './code';

import { connections, sendMessage } from './connection';

// for clarity, a gameID is just a string
type UserId = string;
// used ids for both players and host
type GameId = string;

// interface for user, mostly blank rn but will keep score or smth later.
// UserId is stored in the map for now
export interface User {
	name: string;
	answers: number[];
	scores: number[];
	times: number[];
}

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
	quizOpen: boolean;
	quizData: Quiz;
	answers: Map<UserId, { time: number; answer: number }>;
}

// first key is gameId
const games: Map<GameId, Game> = new Map();

function getUsers(game: Game) {
	return [...game.users.keys(), game.hostId];
}

function endQuestion(gameId: GameId) {
	const game = games.get(gameId);
	if (!game) return;
	const users = getUsers(game);
	const userSockets = connections.get(gameId);
	if (userSockets === undefined) {
		// Player List Not in Connections
		return;
	}

	users.forEach(function (value: UserId) {
		let user = game.users.get(value);
		if (!user) return;
		let endResp = {
			correct: game.quizData.questions[
				game.activeQuestion
			].correctAnswers.includes(user.answers[game.activeQuestion]),

			correctAnswers:
				game.quizData.questions[game.activeQuestion].correctAnswers,

			score: user.scores.reduce((a, b) => a + b, 0),
			scoreChange: user.scores[game.activeQuestion],
			time: user.times[game.activeQuestion],
		};
		let resp = endResp;

		let sock = userSockets.get(value);
		if (sock === undefined) {
			return;
		}
		if (sock.readyState === WebSocket.OPEN) {
			sendMessage(sock, 'endQuestion', resp);
		}
	});
	return;
}

// Input: Game Object
// beginQuestion sends each player and host the current active question
function beginQuestion(gameId: GameId) {
	const game = games.get(gameId);
	if (!game) return;
	const users = getUsers(game);
	const userSockets = connections.get(gameId);
	if (userSockets === undefined) {
		// Player List Not in Connections
		return;
	}
	// TODO: only send question data (dont send answers, etc)
	const question = game.quizData.questions[game.activeQuestion];
	users.forEach(function (value: string) {
		let sock = userSockets.get(value);
		if (sock === undefined) {
			return;
		}
		if (sock.readyState === WebSocket.OPEN) {
			sendMessage(sock, 'startQuestion', question);
		}
	});
	return;
}

export default function registerGameRoutes(app: Express) {
	app.post('/games', (req, res) => {
		try {
			const quizData: Quiz = req.body;
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
				quizOpen: false,
				answers: new Map()
			};
			games.set(response.gameId, data);
			console.log(response);
			res.status(201).json(response);
		} catch (e) {
			// client upload error
			console.log(e);
			res.status(400).send('Invalid JSON file');
			// Todo: further validation
		}
	});

	app.post('/games/:gameId/questions/:index/start', (req, res) => {
		const gameId: GameId = req.params.gameId;
		const index = parseInt(req.params.index);
		const game = games.get(gameId);

		// client-requested game error
		if (game === undefined) {
			res.status(404).send({ ok: false, err: `Game ${gameId} not found` });
			return;
		}

		// TODO: validate this request comes from the host (pending API description)
		// client permission 403 error

		const quiz = game.quizData;
		// out-of-bounds error
		if (index >= quiz.questions.length) {
			res.status(404).send({ ok: false, err: `Question ${index} not found` });
			return;
		}

		// start accepting answers for the question index
		if (index != game.activeQuestion + 1) {
			res.status(400).send({
				ok: false,
				err: `Question ${index} is not next`,
			});
			return;
		}
		game.activeQuestion = index;
		game.quizOpen = true;

		// show question text and answers on both host and player screens
		beginQuestion(gameId);

		res.status(200).send({ ok: true });
	});

	app.post('/games/:gameId/questions/:index/end', (req, res) => {
		const gameId: GameId = req.params.gameId;
		const index = parseInt(req.params.index);
		const game = games.get(gameId);

		// host-requested game error
		if (game === undefined) {
			res.status(404).send({ ok: false, err: `Game ${gameId} not found` });
			return;
		}

		const quiz = game.quizData;
		// out-of-bounds error
		if (index >= quiz.questions.length) {
			res.status(404).send({ ok: false, err: `Question ${index} not found` });
			return;
		}

		// start accepting answers for the question index
		if (index != game.activeQuestion) {
			res.status(400).send({
				ok: false,
				err: `Question ${index} is not open`,
			});
			return;
		}
		game.quizOpen = false;
		// show question text and answers on both host and player screens
		endQuestion(gameId);

		res.status(200).send({ ok: true });
	});

	app.post('/games/:gameId/questions/:index/answer', (req, res) => {
		const gameId: GameId = req.params.gameId;
		// TODO change this to match whatever method we use to authenticate users
		const userId: UserId = req.body.userId;
		const index = parseInt(req.params.index);
		const game = games.get(gameId);

		// client-requested game error
		if (game === undefined) {
			res.status(404).send({ ok: false, err: `Game ${gameId} not found` });
			return;
		}

		// check if question is open
		if (game.activeQuestion != index && game.quizOpen) {
			res
				.status(400)
				.send({ ok: false, err: `Question ${index} is not open for answers` });
			return;
		}

		const answer = req.body.answer;
		if (
			typeof answer != 'number' ||
			answer >= game.quizData.questions[game.activeQuestion].answerTexts.length
		) {
			res
				.status(400)
				.send({ ok: false, err: `Answer index ${answer} is not valid.` });
		}

		// add answer to userId
		const user = game.users.get(userId);
		if (user) {
			if (user.answers[index] !== undefined) {
				res.status(400).send({
					ok: false,
					err: `Answer for Question ${index} already exists`,
				});
				return;
			} else {
				// if a player has joined late, their previous answers will be undefined
				user.answers[index] = answer;
			}
		} else {
			res.status(400).send({ ok: false, err: `User ${userId} does not exist` });
		}

		res.status(200).send({ ok: true });
	});

	app.post('/games/:gameId/players', (req, res) => {
		const body = req.body;
		const gameId: GameId = req.params.gameId;

		if (typeof body.username != 'string') {
			res.status(400).send();
			return;
		}

		const game = games.get(gameId);

		if (game === undefined) {
			res.status(404).send();
			return;
		}

		const username: string = body.username;
		// EW disgusting.... Gets the usernames from the users list
		if ([...game.users.values()].map((usr) => usr.name).includes(username)) {
			res.status(409).send();
			return;
		}

		// Generate Code and Set User Entry
		const id = code.gen(8, getUsers(game));

		game.users.set(id, { name: username, answers: [], scores: [], times: [] });
		res.status(201).json({ ok: true, id });
		return;
	});
}
