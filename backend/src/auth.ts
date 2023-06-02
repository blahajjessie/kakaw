import crypto from 'crypto';

// secret used for token generation
// maybe change to use config file?
const SECRET = crypto.randomBytes(16).toString('hex');

export function generateToken(gameId: string, userId: string) {
	const toBeHashed = `${gameId}.${userId}`;
	const hmac = crypto.createHmac('sha256', SECRET);
	hmac.update(toBeHashed);
	const token = hmac.digest('hex');
	return token;
}

export function validateToken(
	gameId: string,
	userId: string,
	token: string | undefined
): boolean {
	if (!token) {
		return false;
	}

	if (typeof token !== 'string' || token.length !== 64) {
		return false;
	}

	const toBeHashed = `${gameId}.${userId}`;
	const hmac = crypto.createHmac('sha256', SECRET);
	hmac.update(toBeHashed);
	const correctToken = hmac.digest('hex');

	return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(correctToken));
}
