import { Express, NextFunction, Request, Response } from 'express';
import { GameId, Game, gameExist, getGame } from './game';
import { UserId } from './user';
import { newGameResp } from './respTypes';
import { generateToken, validateToken } from './auth';

// first key is gameId

function validateGame(req: Request, res: Response, next: NextFunction) {
	const params = req.params;
	try {
		// console.log(params.gameId)
		if (!gameExist(params.gameId)) {
			// console.log("eek!");
			res
				.status(404)
				.send({ ok: false, err: `Game ${params.gameId} not found` });
			return;
		}
	} catch {
		res.status(404).send({ ok: false, err: `Game ${params.gameId} not found` });
		return;
	}

	// console.log("valid game")
	next();
}

function validateQuestion(req: Request, res: Response, next: NextFunction) {
	const params = req.params;
	if (req.params.gameId === undefined) {
		res.status(400).send({ ok: false, err: `Question number is required` });
		return;
	}
	const game = getGame(params.gameId);

	try {
		parseInt(params.index);
	} catch {
		// should this be a different error
		res
			.status(404)
			.send({ ok: false, err: `Question ${params.index} not a number` });
		return;
	}
	if (parseInt(params.index) > game.quizData.questions.length) {
		res
			.status(404)
			.send({ ok: false, err: `Question ${params.index} not found` });
		return;
	}
	next();
}

function validatePlayerToken(req: Request, res: Response, next: NextFunction) {
	// extract the token from the authorization header
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		res.status(401).send({ ok: false, err: 'Token is missing' });
		return;
	}

	// validate authorization
	const gameId: GameId = req.params.gameId;
	const userId: UserId = req.body.userId;
	const isValid = validateToken(gameId, userId, token);
	if (!isValid) {
		res.status(403).send({ ok: false, err: 'Invalid token' });
		return;
	}
	next();
}

function validateHostToken(req: Request, res: Response, next: NextFunction) {
	// extract the token from the authorization header
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		res.status(401).send({ ok: false, err: 'Token is missing' });
		return;
	}

	// validate authorization
	const gameId: GameId = req.params.gameId;
	const game = getGame(gameId);
	const userId: UserId = game.hostId;
	const isValid = validateToken(gameId, userId, token);
	if (!isValid) {
		res.status(403).send({ ok: false, err: 'Invalid token' });
		return;
	}
	next();
}

export default function registerGameRoutes(app: Express) {
	app.use('/games/:gameId/', validateGame);
	app.use('/games/:gameId/questions/:index/', validateQuestion);

	app.post('/games', (req, res) => {
		if (!req.body) {
			// console.log(req.body)
			res
				.status(400)
				.send({ ok: false, err: 'Quiz validation failed for : no body' });
		}
		try {
			let freshGame = new Game(req.body);
			let hostToken = generateToken(freshGame.id, freshGame.hostId);
			let response: newGameResp = {
				gameId: freshGame.id,
				hostId: freshGame.hostId,
				token: hostToken,
			};
			console.log(response);
			res.status(201).json(response);
		} catch (e) {
			// client upload error
			console.log(e);
			res.status(400).send({
				ok: false,
				err: ' Quiz validation failed for : Invalid JSON file' + e,
			});
			return;
		}
		return;
	});

	app.post(
		'/games/:gameId/questions/:index/start',
		validateHostToken,
		(req, res) => {
			const index = parseInt(req.params.index);
			const game = getGame(req.params.gameId)!;
			console.log('start');
			// start accepting answers for the question index

			if (index != game.activeQuestion + 1) {
				res.status(404).send({
					ok: false,
					err: `Question ${index} is not next`,
				});
				return;
			}

			game.beginQuestion();

			res.status(200).send({ ok: true });

			return;
		}
	);

	app.post(
		'/games/:gameId/questions/:index/end',
		validateHostToken,
		(req, res) => {
			const gameId: GameId = req.params.gameId;
			const index = parseInt(req.params.index);
			const game = getGame(gameId)!;

			// host-requested game error
			// out-of-bounds error

			// stop accepting answers for the question index
			if (index != game.activeQuestion) {
				res.status(400).send({
					ok: false,
					err: `Question ${index} is not open`,
				});
				return;
			}

			// show question text and answers on both host and player screens
			game.endQuestion();

			res.status(200).send({ ok: true });
			return;
		}
	);

	app.get('/games/:gameId/results', validateHostToken, (req, res) => {
		const gameId = req.params.gameId;
		const game = getGame(gameId)!;

		// host end results
		game.sendResults();
		res.status(200).send({ ok: true });
		return;
	});

	app.get('/games/:gameId/export-quiz', (req, res) => {
		const gameId = req.params.gameId;
		const game = getGame(gameId);
		res.status(200).json(game.quizData);
		return;
	});

	app.post('/games/:gameId/players', (req, res) => {
		const body = req.body;
		if (typeof body.username != 'string') {
			res.status(400).send({
				ok: false,
				err: 'Add username fail, Username is not a string',
			});
			return;
		}
		const game = getGame(req.params.gameId);

		const username: string = body.username;
		let uid: UserId;
		try {
			uid = game.addPlayer(username);
		} catch (e) {
			res
				.status(409)
				.send({ ok: false, err: 'Add username fail. Reason: ' + e });
			return;
		}
		// Generate Code and Set User Entry
		let playerToken = generateToken(req.params.gameId, uid);
		res.status(201).json({ ok: true, id: uid, token: playerToken });
		game.sendPlayerAction(uid);
		return;
	});

	app.post(
		'/games/:gameId/questions/:index/answer',
		validatePlayerToken,
		(req, res) => {
			const gameId: GameId = req.params.gameId;
			// TODO change this to match whatever method we use to authenticate users
			const userId: UserId = req.body.userId;
			const index = parseInt(req.params.index);
			const game = getGame(gameId)!;

			// check if question is open
			if (game.activeQuestion != index || !game.quizOpen) {
				res.status(400).send({
					ok: false,
					err: `Question ${index} is not open for answers`,
				});
				return;
			}

			const answerChoice = req.body.answer;
			if (
				typeof answerChoice != 'number' ||
				answerChoice >=
					game.quizData.getAnswerChoices(game.activeQuestion).length
			) {
				res.status(400).send({
					ok: false,
					err: `Answer index ${answerChoice} is not valid.`,
				});
				return;
			}
			// validate time
			const ansTime: number = Date.now() - game.startTime;
			console.log(ansTime);
			try {
				game.getUser(userId).answer(game.activeQuestion, ansTime, answerChoice);
			} catch {
				// console.log('answer() failed; the error message might be right');
				res
					.status(400)
					.send({ ok: false, err: `User ${userId} does not exist` });
				return;
			}

			res.status(200).send({ ok: true });
			game.sendPlayerAction(userId);
			return;
		}
	);

	app.delete('/games/:gameId', validateHostToken, (req, res) => {
		const game = getGame(req.params.gameId);
		try {
			game.endGame();
			res.status(200).send({ ok: true });
		} catch (e) {
			// console.log('answer() failed; the error message might be right');
			res
				.status(500)
				.send({ ok: false, err: `Unable to delete game. Reason:` + e });
			return;
		}
	});

	app.delete(
		'DELETE /games/:gameId/players/:playerId',
		validateHostToken,
		(req, res) => {
			const game = getGame(req.params.gameId);
			const uid = req.params.playerId;
			try {
				game.getUser(uid);
			} catch {
				// console.log('answer() failed; the error message might be right');
				res.status(400).send({ ok: false, err: `User ${uid} does not exist` });
				return;
			}
			try {
				game.kickUser(uid, ' the host has kicked you from the game');
				res.status(200).send({ ok: true });
				return;
			} catch (e) {
				// console.log('answer() failed; the error message might be right');
				res
					.status(500)
					.send({ ok: false, err: `Unable to Kick user. Reason:` + e });
				return;
			}
		}
	);
}
