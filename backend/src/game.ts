import express from 'express';
import { Express } from 'express';
import * as code from './code';
import * as user from './user';

const app = express();
app.use(express.json());
const usedGame: string[] = [];
// used ids for both players and host
const usedId: string[] = [];
// first key is gameId
const games: Map<string, any> = new Map();
let open = -1;

export default function registerGameRoutes(app: Express) {
    app.get('/', (_req, res) => {
        res.send('Hello, world!');
    });

    app.post('/games', (req, res) => {
        try {
            let quizData = JSON.parse(req.body);
            const id = {
                gameId: code.gen(5, usedGame),
                hostId: code.gen(8, usedId),
            };
            // associate gameId with data and host
            const data = { quiz: quizData, host: id.hostId };
            games.set(id.gameId, data);
            res.send(id);
        } catch (e) {
            // client error
            console.error('Invalid JSON file:', e);
            res.status(400).send('Invalid JSON file');
        }
    });
    
    app.post('/games/:gameId/players', (_req, res) => {
        user.userHandle(_req.params.gameId, _req, res);
    });
    
    app.get('/games/:id/questions/:index/start', (req, res) => {
        const gameId = req.query.gameId as string;
        const hostId = req.query.hostId as string;
        const index = parseInt(req.params.index);
        const game = games.get(gameId);
    
        // client-requested game error
        if (game === undefined) {
            res.status(404).send(`Game ${gameId} not found`);
            return;
        }
    
        const host = game.host;
        // client permission error
        if (host !== hostId) {
            res.status(403).send(`Incorrect host of game ${gameId}`);
            return;
        }
    
        const quiz = game.quiz;
        // out-of-bounds error
        if (index >= quiz.questions.length) {
            res.status(404).send(`Question ${index} not found`);
            return;
        }
    
        // start accepting answers for the question index
        open = index;
    
        // show question text and answers on both host and player screens? 
    
        res.send({ ok: true });
    });
    
    app.post('/games/:id/questions/:index/answer', (req, res) => {
        const gameId = req.query.gameId as string;
        const playerId = req.query.playerId as string;
        const index = parseInt(req.params.index);
        const game = games.get(gameId);
    
        // client-requested game error
        if (game === undefined) {
            res.status(404).send(`Game ${gameId} not found`);
            return;
        }
    
        const quiz = game.quiz;
        const question = quiz.questions[index];
    
        // check if question is open
        if (open != index) {
            res.status(400).send(`Question ${index} is not open for answers`);
            return;
        }
    
        // add map w/ player ids and answers?
        const answer = req.body.answer;
    
        // not accepting answers for the question index from the playerId 
    });
};