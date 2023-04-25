import { Express } from 'express';
import * as code from './code';

import {connections, sendMessage} from './connection';

// for clarity, a gameID is just a string
type UserId = string;
// used ids for both players and host
type GameId = string;

// interface for user, mostly blank rn but will keep score or smth later.
// Userid is stored in the map for now
export interface User {
	name: string;
    answers: number[];
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
};

function getUsers(game: Game) {
	return [...(game.users.keys(), game.hostId)];
}

// Input: Game Object
// beginQuestion sends each player and host the current active question
function beginQuestion(game: Game, gameId: GameId) {
	const users = getUsers(game);
	const userSockets = connections.get(gameId);
	if (userSockets === undefined) {
		// Player List Not in Connections
		return;
	}
	const question = JSON.stringify(game.quizData.questions[game.activeQuestion]);
	users.forEach(function (value: string) {
		let sock = userSockets.get(value);
		if (sock === undefined) {
			return;
		}
		if(sock.readyState === WebSocket.OPEN) {
			sendMessage(sock, 'startQuestion', question);
		}
	});
    return;
}

// first key is gameId
const games: Map<GameId, Game> = new Map();

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
			};
			games.set(response.gameId, data);
            console.log(response);
			res.send(response);
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
			res.status(404).send({ ok: false , err: `Game ${gameId} not found`});
			return;
		}

		// we have no way of validating the host yet
		// client permission 403 error

		const quiz = game.quizData;
		// out-of-bounds error
		if (index >= quiz.questions.length) {
			res.status(404).send({ ok: false , err: `Question ${index} not found`});
			return;
		}

		// start accepting answers for the question index
		game.activeQuestion = index;

		// show question text and answers on both host and player screens
		beginQuestion(game, gameId);
        game.users.set('123', { name: 'bob', answers: [] });

		res.status(200).send({ ok: true });
	});

	app.post('/games/:gameId/questions/:index/answer', (req, res) => {
		const gameId: GameId = req.params.gameId;
		const userId: UserId = req.body.userId;
		const index = parseInt(req.params.index);
		const game = games.get(gameId);

		let answer: number;
        try {
            answer = parseInt(req.body.answer);
        } catch (e) {
            answer = -1;
        }

		// client-requested game error
		if (game === undefined) {
			res.status(404).send({ok: false, err: `Game ${gameId} not found`});
			return;
		}

		const quiz = game.quizData;

		// check if question is open
		if (game.activeQuestion != index) {
			res.status(400).send({ok: false, err: `Question ${index} is not open for answers`});
			return;
		}

		// add answer to userId
        const user = game.users.get(userId);
        if (user) {
            if (user.answers[index] !== undefined) {
                res.status(400).send({ok: false, err: `Answer for Question ${index} already exists`});
                return;
            } else {
                // if a player has joined late, their previous answers will be undefined
                user.answers[index] = answer;
                console.log(user.answers);
            }
        } else {
            res.status(400).send({ok: false, err: `User ${userId} does not exist`});
        }

        res.status(200).send({ok: true});
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

		game.users.set(id, { name: username, answers: [] });
		const r = { id: id };
		res.status(201).json(r).send();
		return;
	});
}
