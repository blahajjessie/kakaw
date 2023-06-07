Currently Implemented in `game.ts`

## `getGame` function (gameId: GameId)

takes a game id and returns the respective game if it exists

## `gameExist` function (gameId: GameId)

takes a game id and returns true if the respective game exists and false if not

## `waitTimer` function (ms: number)

takes milliseconds allocated to answering a quiz question and

# `Game` Class

- `id`: id of the game
- `hostId`: id of the host
- `host`: the user information corresponding to the host
- `quizData`: all data pertaining to the uploaded quiz
- `players`: map of all user ids and their respective user
- `quizOpen`: boolean indicating if the quiz is open to accepting answers
- `activeQuestion`: keeps track of the current question
- `startTime`: keeps track of current datetime for time taken to answer calculation in scoring
- `timer`: numeric timer identifier
- `hostTimeout`: numeric timer identifier

## `endQuestion` ()

clears the timer, sends all the necessary end of question data to all users for results, and sets quizOpen to false to indicate that no further answers will be accepted

## `getQuestionData` ()

returns data about the current question

## `sendPlayerAction` (uid: UserId)

takes a user id and retrieves the respective user, creates an object representing the player and their action, and sends this action data to the host

## `beginQuestion` ()

increments the counter for active question, sends all necessary information to answer the question and other display elements to each user, initiates the timer to the allocated time for that question, and sets the start time to the current time for calculation purposes in scoring later

## `getUsers` ()

returns all the players and the host

## `getPlayers` ()

returns all the players

## `getUser` (id: UserId)

takes a user id andd returns all the respective user information 

## `iterateUsers` (f: (u: User) => any)

takes a function and applies to each user when iterating over the users in a game and returns an array containing the values returned by the function for each user

## `addPlayer` (username: string)

takes a username and adds it to the map of players if it's not already being used in the game

## `getLeaderboard` ()

generates a new leaderboard by sorting the leaderboard components of each player based on descending score, then calculates and changes each player's leaderboard component `positionChange` utilizing the recorded player's previous position (NaN if this is the first question they answered) and their current position in the newly generated leaderboard

## `getPlayerResults` ()

gets all player data

## `sendResults` ()

sends the leaderboard and data of all players to the host, and sends the leaderboard and only the corresponding player data to the player

## `setHostTimeout` ()

sets a timer for the host to reconnect to the game if disconnected

## `endHostTimeout`()

handles the end of a host timeout by logging a message if the host is already connected or connecting for the first time, otherwise it clears the scheduled timeout and logs a message indicating that the host has reconnected

## `kickUser` (uid: UserId, reason: string)

takes a user id and reason, kills the player's WebSocket connection, sends the reason to the user, and removes them from the players map

## `endGame` ()

kicks all users in the game and removes the game from the active games map due to host disconnection

## `updateUser` (uid: UserId)

takes a user id and handles the end of a host timeout if the user id belongs to the host or the end of a player timeout if it belongs to a player

## `sendPlayerUpdates` ()

sends player action data

## `updateHost` ()

updates host status

## `updatePlayer` (uid: UserId)

updates player status

## `sendEndQuestionState` (u: User)

takes a user and sends the end state data to that user after a question has ended

## `sendMidQuestionState` (u: User)

takes a user and sends the mid-question state data to that user