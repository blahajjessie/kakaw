# Websockets

## Server.ts
Connect to the websocket at `/connect?gameId={game ID}&playerId={player ID}&token={authentication token}`
- Calls handleConnection()

### Data Structures:

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

#### Fields: 
- reason (string)

## `startQuestion`

Sent by server whenever a new question is available

#### Fields: 
- `questionText`: The text for the question
- `answerTexts`: The answer texts (same as in JSON)
- `time` (number): The number of *milliseconds* that are left in the question (where 0 is the end of the question)
- `index` (number): the number of the question being started.
- `score` (number): player’s current score, the host will receive garbage
- `username`: the name of the player
- `totalQuestions`: the total number of questions in the quiz (TODO)


## `endQuestion`

Sent by server when the timer on a question runs out or the host clicks “End now,” and moves clients to the screen to review results
The same message is sent to the host, but the information about the answer choice may be inaccurate. 

#### Fields: 
- `correctAnswers` (numeric array) : 
- `score` (number) = the player’s current score, the host will receive garbage
- `scoreChange` (number) = how much their score increased due to this question, The host will receive garbage
- `correct` (boolean) : if the player's answer to the question is correct. The host will receive garbage
- `leaderboard`: sorted array of [Leaderboard](host-http.md#leaderboard) to represent the player score
- `positionChange`: How much the position has changed in the leaderboard. 0 if the position has stayed the same, negative if it has decreased. Sends `NaN` if this is the player's first answered question. (TODO)
- `responseTime` (number) : the amount of time the player took to answer the question (ms)
- `questionText` (string) : The question
- `answerTexts` (string[]) : string[] of the answer choices
- `index` (number) : the number of the question that just ended
- `username` (string) : the name of the player
- `explanations` (string[] | null) : The explanations for right and wrong answers. 
        Sends `null` if there are no explanations in the quiz, otherwise an array of strings
- `yourAnswer` (number) : The index of the player's answer, -1 if the user didn't answer
- `totalQuestions`: the total number of questions in the quiz (TODO)

## `playerResults`
Sends a player their end of game results (TODO)

#### Fields:
- `leaderboard` ([`Leaderboard[]`](host-http.md#leaderboard))
- `numCorrect`(number) : The number of correct answers the player made
- `numWrong` (number) : The number of incorrect answers the player made + questions that the player did not answer at all
- `username` (string) : The username of the player
- `score` (number) : the player's score

## `hostResults`
Sends the host the results for all players (TODO?)

#### Fields:
- `leaderboard` ([`Leaderboard[]`](host-http.md#leaderboard))
- `players`: array containing objects with the following keys (same meaning as in `playerResults`):
    - `numCorrect` (number)
    - `numWrong` (number)
    - `username` (string)
    - `score` (number)


## `playerAction`

Sends usernames and IDs when a player completes an action (joining the game or answering a question).

#### Fields: 
- `players`: an object with keys of playerId's and values of usernames.

#### Example:
```
players:{
    "42069420" : "Alissa",
    "69420420" : "ray"
}
```
