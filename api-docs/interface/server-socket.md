# Websockets

## Server.ts
Connect to the websocket at `/connect?gameId={game ID}&playerId={player ID}`
- Calls handleConnection()

### Data Structs:

- Every message is a JSON object with type as a string, and potentially other fields depending on the type.

- When a client connects to the server and the game has already started, the server immediately sends a question or endQuestion (or lobby if client is the host) message to catch them up to the current state of the game. Before then, the client just displays “Waiting for the host to start the game” or something. This way the same logic handles both “client joined and is waiting for game to start” and “client joined late and is waiting for the server to respond to them.”

# Types

These are all defined in `respTypes.ts` with 
- a class that contains the name and data
- an interface that contains the data

These messages are the same for players and the host unless specified.

Possible types (all sent from server to client unless otherwise specified):


## `end`

Whoever sends this message is closing the connection for the specified reason. E.g. the server could send {“type”: “end”, “reason”: “That game does not exist”}

Fields: 
- reason (string)

## `startQuestion`

Sent by server whenever a new question is available

Fields: 
- `questionText`: The text for the question
- `answerTexts`: The answer texts (same as in JSON)
- `time` (number): The number of *milliseconds* that are left in the question (where 0 is the end of the question)
- `index` (number): the number of the question being started.
- `score` (number): player’s current score, the host will receive garbage
- `username`: the name of the player. 

## `endQuestion`

Sent by server when the timer on a question runs out or the host clicks “End now,” and moves clients to the screen to review results
The same message is sent to the host too except with only the correctAnswers field (maybe a leaderboard later).

Fields: 
- `correctAnswers` (numeric array) : 
- `score` (number) = the player’s current score, the host will receive garbage
- `scoreChange` (number) = how much their score increased due to this question, The host will receive garbage
- `correct` (boolean) : if the player's answer to the question is correct. The host will receive garbage
- `leaderboard`: sorted array of [{name: string, score: number }, …]
- `responseTime` : number: the amount of time the player took to answer the question (ms)


## `playerAction`

Every time a player completes an action (join, answer) the host is sent this message
It will contain a player id and username that has completed the most recent action.

This may be sent many times rapidly on the case of a host just connecting. 

Fields: 
- `id` (userId): the player's user ID
- `username` (string): the name of the player


