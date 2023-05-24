# Websockets

## Server.ts
Connect to the websocket at `/connect?gameId={game ID}&playerId={player ID}`
- Calls handleConnection()

## Connection.ts

### Data Structs:


- Every message is a JSON object with type as a string, and potentially other fields depending on the type.

- When a client connects to the server and the game has already started, the server immediately sends a question or endQuestion (or lobby if client is the host) message to catch them up to the current state of the game. Before then, the client just displays “Waiting for the host to start the game” or something. This way the same logic handles both “client joined and is waiting for game to start” and “client joined late and is waiting for the server to respond to them.”

# Types

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
- `time` (number): The number of *miliseconds* that are left in the question (where 0 is the end of the question)
- `score` (number): player’s current score, the host will recieve garbage
- `username`: the name of the player. 

## `endQuestion`

Sent by server when the timer on a question runs out or the host clicks “End now,” and moves clients to the screen to review results
The same message is sent to the host too except with only the correctAnswers field (maybe a leaderboard later).

Fields: 
- `correctAnswers` (numeric array) : 
- `score` (number) = the player’s current score, the host will recieve garbage
- `scoreChange` (number) = how much their score increased due to this question, The host will recieve garbage
- `correct` (boolean) : if the player's answer to the question is correct. The host will recieve garbagae
- `leaderboard`: sorted array of [{name: string, score: number }, …]


## `lobby`

Only sent to host before the game starts; this has all the players who have joined so far

Fields: 
- `players`: map(`id`, `username`) 

