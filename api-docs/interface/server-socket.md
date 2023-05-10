# Websockets

## Server.ts
Connect to the websocket at `/connect?gameId={game ID}&playerId={player ID}`
- Calls handleConnection()

## Connection.ts

### Data Structs:

<!-- This should move somewhere else (the game object?) -->
`connections` (`Map<string, Map<string, WebSocket>>`)

- Every message is a JSON object with type as a string, and potentially other fields depending on the type.

- When a client connects to the server and the game has already started, the server immediately sends a question or endQuestion (or lobby if client is the host) message to catch them up to the current state of the game. Before then, the client just displays “Waiting for the host to start the game” or something. This way the same logic handles both “client joined and is waiting for game to start” and “client joined late and is waiting for the server to respond to them.”

## 

These messages are the same for players and the host unless specified.

Possible types (all sent from server to client unless otherwise specified):
end

Other fields: reason (string)
Whoever sends this message is closing the connection for the specified reason. E.g. the server could send {“type”: “end”, “reason”: “That game does not exist”}
startQuestion

Other fields: questionText, answerText (same as in JSON), endTimestamp: numeric UNIX timestamp (milliseconds) when the timer to answer this question will out, score (number): player’s current score
Sent by server whenever a new question is available
endQuestion
Fields: correct (boolean), correctAnswers (numeric array), score (number) = the player’s current score, scoreChange (number) = how much their score increased due to this question, 
Host only: leaderboard: sorted array of [{name: string, score: number }, …]
Sent by server when the timer on a question runs out or the host clicks “End now,” and moves clients to the screen to review results
The same message is sent to the host too except with only the correctAnswers field (maybe a leaderboard later).
lobby
Fields: players (object mapping ID to username)
Only sent to host before the game starts; this has all the players who have joined so far
