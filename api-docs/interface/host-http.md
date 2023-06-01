# Game Host (teacher) API's

## Create game
#### Description:
Host creates a game

#### Endpoint: 
`POST /games`

#### `body`: 
JSON file of the questions and answers [(a `quiz`)](../backend/Quiz.md)


#### Server Event
The game opens on the server side, and is now accepting players via the join code (which is the game ID)
Upon receipt of this, the host should display a screen showing a list of players. 

#### Response:
`{gameId: string, hostId: string}`
- `gameId` is the id of the game that was started
- `hostId` is the id of the host

## Start a question
#### Description:
Start accepting answers for the next question 

#### Endpoint:
`POST /games/:id/questions/:index/start`
- `:id:` the id of the game that the question should be started on
- `:index` : the question number that should be started.
  Send this with index 0 to start the game, then 1, 2, 3, etc. until you are out of questions.

#### Server event:
Show the question on all user screens [(a `startQuestion`)](server-socket.md#startquestion)

#### response:
`{ok: bool, err?: string}`
- `ok` is true if the question advanced, false if it wasn't. 
- `err` is an optional error message representing what may have happened

## End a question
#### Description:
skips the rest of the current question’s timer if not ended yet, and shows players answers. 

#### Endpoint:
`POST /games/:id/questions/:index/end`
- `:id:` the id of the game that the question should be ended
- `:index` : the question number that should be ended.
  Send this with index 0 to start the game, then 1, 2, 3, etc. until you are out of questions.


#### Server event:
- The next question will not be showing or accepting answers. 
- Players will get their answers
- Skips question timer if not ended yet
- Show the results on all user screens [(an `endQuestion`)](server-socket.md#endquestion)

#### Response:
`{ok: bool, err?: string}`
- `ok` is true if the question was ended, false if it wasn't. 
- `err` is an optional error message representing what may have happened

## Show results

#### Endpoint:
 `GET /games/:id/results`:
- `:id:` the id of the game that should be sent

#### Description:
Returns all player names with their respective score and all their correct answers after the game has finished.

#### Server Event:
Sends the end of game results to all players also

#### Response:
`{ok: bool, err?: string, results: Leaderboard[]}`
- `ok` is a message stating whether the results succeeded
- `err` is a message indicating some reason that it may have failed
- `results` is an array of [Leaderboard](###leaderboard) objects
- `correctness`(number[]) : An array of the score that each player got, in percent (TODO)

## Get Export
#### Description: 
Sends the quiz json to the host

#### Endpoint:
`GET /games/:id/export-quiz`
- `id` : the game id

#### Server event:
None

#### Response: 
a complete [`quiz` Json file](../backend/Quiz.md)

## Kick player
#### Description:
Removes the specified player from the game. Can be called at any time.

#### Endpoint:
`DELETE /games/:gameId/players/:playerId`

#### Server Event:
- close the connection for the specified player.
- The player will receive a [message](server-socket.md#end) saying that they have been kicked by the host
- The host will not receive a WS message. Instead, they remove the player from their local Map of players upon hearing the successful response for this request.


#### Response:
`{ok: bool, err?: string}`
- `ok` returns true or false if the player was kicked
- `err` will be a string if the kick failed

## End game

#### Description: 
Ends the game and kicks all players

#### Endpoint:
`DELETE /games/:gameId`
- `gameId` is the id of the game to end

#### Server event: 
- All players receive a [message](server-socket.md#end) informing them that the game has been ended by the host

#### Response:
None. The game is now closed and the host socket has been closed

### Leaderboard
This contains data about a player's score. An array of these can be used to send the leaderboard

- `name` (string) : the player's username 
- `score` (number) : the score of the player
- `positionChange` (number) : The amount that the player's score has changed (TODO)