# Authentication

## Interface

The player create and game create endpoints now return an additional `token` field, of type `string`. Every client stores this token somehow (probably local storage or session storage). Clients do not care what the value is, they just pass it to the server. For any endpoint that requires authentication (really just any endpoint), clients include the header `Authorization: Bearer <token>`. Servers reply with HTTP 401 if the token is missing and 403 if it is incorrect.

## Server-side: generating a token

The server uses [HMAC](https://en.wikipedia.org/wiki/HMAC)-SHA256, which combines a secret and some input to create a hash that could only have been created by someone knowing both values.

The server has a secret which is never revealed to anyone. When a player is created (either for the host because a game was created, or when a normal player joins), the server creates the string `gameId.playerId` and computes the HMAC of that in hexadecimal:

```js
import crypto from 'crypto';

// in real life this is either a configuration flag, or maybe generate it with a secure RNG
const SECRET = 'monkey';

const gameId = '12345';
const playerId = '58293862';

const toBeHashed = `${gameId}.${playerId}`;
const hmac = crypto.createHmac('sha256', SECRET);
hmac.update(toBeHashed);
const token = hmac.digest('hex');
console.log(token); // b2938f962c20c4f24c4b41c1d4bb0cb084827450ae62aad59de8a0bedc8c3a8e
```

## Server-side: validating a token

When the server needs to determine if a request is authorized, it can use the game and player IDs from the request to determine what the hash should be, and then make sure the token that was sent matches (code like this should probably be some Express middleware, so you can easily add it to every route that needs authorization, but I don't know exactly how that would look):

```js
const gameIdInRequest = '12345';
const playerIdInRequest = '58293862';
const tokenInRequest = 'b2938f962c20c4f24c4b41c1d4bb0cb084827450ae62aad59de8a0bedc8c3a8e';

const toBeHashed = `${gameIdInRequest}.${playerIdInRequest}`;
const hmac = crypto.createHmac('sha256', SECRET);
hmac.update(toBeHashed);
const correctToken = hmac.digest('hex');

// DO NOT USE NORMAL STRING COMPARISON (==)
// use crypto.timingSafeEqual instead
if (crypto.timingSafeEqual(Buffer.from(tokenInRequest), Buffer.from(correctToken))) {
	console.log('user is authorized!');
} else {
	console.log('user is not authorized');
}
```
