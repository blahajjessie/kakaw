import { gen } from './code';
import {Request, Response} from 'express';

export const games: Map<string, Map<string, string>> = new Map();

export function userHandle(gameId: string, req: Request, res: Response) {
    const { body } = req;

    if (!body.username) {
        res.status(400).send();
        return;
    }

    if (!games.has(gameId)) {
        res.status(404).send();
        return;
    }

    let playerSet = games.get(gameId);

    if (playerSet === undefined) {
		playerSet = new Map();
		games.set(gameId, playerSet);
	}

    const username = body.username;
    if (playerSet.has(username)) {
        res.status(409).send();
        return;
    }

    // Functionally done to make use of code generation
    // but I don't want to store the id's more than they already are (twice now)
    const used: string[] = Array.from(playerSet.values());
    const id = gen(8, used);

    playerSet.set(username, id);
    const r = {id: id};
    res.status(201).json(r).send();
    return;
}
