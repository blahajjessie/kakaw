import { Express } from 'express';
import { WebSocket } from 'ws';

import { sendMessage } from './connection';
import { UserId, GameId, QuizQuestion, Game, EndResp, } from './gameTypes';
import { gen } from './code';
// first key is gameId
const games: Map<GameId, Game> = new Map();

export function getGame(gameId: GameId): Game {
	let out = games.get(gameId);
	if (!out) throw new Error('Game does not exist');
	return out;
}

function endQuestion(gameId: GameId) {
	const game = games.get(gameId);
	if (!game) return;
	const users = game.getUsers();

	let qAns = game.quizData.questions[game.activeQuestion].correctAnswers;
	let leaderboard: { name: string; score: number }[] = [];
	users.forEach(function (playerId: UserId) {
		// host isn't participating
		if (playerId == game.hostId) return;
		let resp = game.addScore(playerId);
		let playerSocket = game.getWs(playerId);
		if (playerSocket === undefined) {
			return;
		}
		if (playerSocket.readyState === WebSocket.OPEN) {
			sendMessage(playerSocket, 'endQuestion', resp);
		}
		leaderboard.push({ name: game.getUser(playerId).name, score: resp.score });
	});

	// host view
	leaderboard.sort((a, b) => b.score - a.score);
	let hostResp = {
		correctAnswers: qAns,
		leaderBoard: leaderboard,
	};
	const hostId = game.hostId;
	const hostSocket = game.getWs(hostId);
	if (hostSocket !== undefined && hostSocket.readyState === WebSocket.OPEN) {
		sendMessage(hostSocket, 'endQuestion', hostResp);
	}

	game.resetTimer();
	return;
}

// Input: Game Object
// beginQuestion sends each player and host the current active question
function beginQuestion(gameId: GameId) {
	const game = games.get(gameId);
	if (!game) return;
	const users = game.getUsers();

	// TODO: only send question data (dont send answers, etc)
	const question = game.getQuestionData();
	if (!question) {
		// TODO: send error
		return;
	}

	// remaining time should be timeLimit unless a new player has joined
	if (game.timer.beginTimestamp == -1) {
		// check if questionTime is valid, else timeLimit is default time
		const questionOptionalTime = question.time;
		if (typeof questionOptionalTime !== 'undefined' && !isNaN(questionOptionalTime)) {
			game.timer.timeLimit = questionOptionalTime * 1000;
		} else {
			game.timer.timeLimit = game.quizData.meta.timeDefault * 1000;
		}
		game.timer.beginTimestamp == Date.now();
		game.timer.endTimestamp == Date.now() + game.timer.timeLimit;
	} 

	const beginResp = {
		question: question.questionText,
		answers: question.answerTexts,
		time: game.timer.endTimestamp - Date.now(),
	};

	users.forEach(function (playerId: UserId) {
		let sock = game.getWs(playerId);
		if (sock === undefined) {
			return;
		}
		console.log(sock.readyState);
		if (sock.readyState === WebSocket.OPEN) {
			sendMessage(sock, 'startQuestion', question);
		}
		game.initScore(playerId);
	});
	game.runTimer(beginResp.time);
	return;
}

export default function registerGameRoutes(app: Express) {
	app.post('/games', (req, res) => {
		if (!req.body) {
			res.status(400).send('Invalid JSON file');
		}
		try {
			const response = {
				gameId: gen(5, [...games.keys()]),
				hostId: gen(8, []),
			};
			let freshGame = new Game(response.hostId, req.body);
			// req.body is the quiz
			games.set(response.gameId, freshGame);
			console.log(response);
			res.status(201).json(response);
		} catch (e) {
			// client upload error
			console.log(e);
			res.status(400).send('Invalid JSON file');
			// Todo: further validation
		}
		return;
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
		
		return;
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
		return;
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
			answer >= game.getQuestionData().answerTexts.length
		) {
			res
				.status(400)
				.send({ ok: false, err: `Answer index ${answer} is not valid.` });
			return;
		}

		// validate time
		const ansTime: number = Date.now() - game.timer.beginTimestamp;
		if (
			typeof ansTime != 'number' ||
			(game.timer.timeLimit !== undefined && ansTime > game.timer.timeLimit) ||
			ansTime < 0
		) {
			res
				.status(400)
				.send({ ok: false, err: `Time taken ${ansTime} is not valid.` });
			return;
		}

		try {
			game.answer(userId, ansTime, answer);
		} catch {
			console.log('answer() failed; the error message might be right');
			res.status(400).send({ ok: false, err: `User ${userId} does not exist` });
			return;
		}

		res.status(200).send({ ok: true });
		return;
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
		if (game.getUserNames().includes(username)) {
			res.status(409).send();
			return;
		}

		// Generate Code and Set User Entry
		const id = gen(8, game.getUsers());
		game.addPlayer(id, username);
		res.status(201).json({ ok: true, id });
		return;
	});

	app.get('/games/:id/results', (req, res) => {
		const gameId = req.params.id;
		const game = games.get(gameId);

		if (!game) {
			res
				.status(404)
				.send({ ok: false, err: `Game ${gameId} not found` });
			return;
		}

		// host end results
		const hostId = game.hostId;
		const hostSocket = game.getWs(hostId);
		if (hostSocket !== undefined && hostSocket.readyState === WebSocket.OPEN) {
			sendMessage(hostSocket, 'results', game.getLeaderboard());
		}

		res.status(200).send({ ok: true });
		return;
	});
}
