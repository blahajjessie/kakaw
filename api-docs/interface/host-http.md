# Game Host (teacher) API's

### Create game
Endpoint: `POST /games`: create a game (does not start it yet)
`body:` JSON file of the questions and answers
Description: Host creates a game
Server sends response of: {gameId: string, hostId: string}

The game opens on the server side, and is now accepting players via the join code (which is the game ID)
Upon recept of this, the host should display a screen showing a list of players. 

### Start a question

Endpoint : `POST /games/:id/questions/:index/start`
Description : start accepting answers for the next question 
Server event: Show the question on all user screens (via a websocket #TODO)
response: {ok: bool, err?: string}

- `:id:` the id of the game that the question should be started on
- `:index` : the question number that should be started. 
Send this with index 0 to start the game, then 1, 2, 3, etc. until you are out of questions.


### Skip a question

Endpoint: `POST /games/:id/questions/:index/end`
Description : skips the rest of the current question’s timer if not ended yet, and shows players answers. 
Server event: The next question will not be showing or accepting answers. 
Players will get their answers
Skips question timer if not ended yet
no request body here (we will work on host authentication later)


### Show results
endpoint: `GET /games/:id/results`: 
Description: Returns all player names with their respective score and all their correct answers after the game has finished.
Server Event: Show it on the host’s screen
results: `Leaderboard[]`,
where a leaderboard is 
#### Leaderboard
- `name` (string) : the player's username 
- `score` (number) : the score of the player


Response: `{ok: bool, err?: string}`



