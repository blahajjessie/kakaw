Currently Implemented in `user.ts`

# `User` Class

- `name`: The username that the player assigns themself. As the host, they are given the quiz's author name.
- `id`: The user's generated UserId for the session.
- `answers`: An array of AnswerObj. Each AnswerObj contains the following information about the player's response to the respective question: `totalPoints` of the question, `totalTime` of the question, `time` taken for the player to answer, `answer` chosen by the player, `correct`, and `score` gained based on correctness and time taken.
- `connection`: The user's WebSocket connection.
- `previousPosition`: The user's previous Leaderboard position. Default is -1.

## `totalScore` ()

returns user's total score 

## `getCorrect` ()

returns an array of question indices that the user answered correctly

## `answer` (qn: number, time: number, choice: number)

takes in a question number, time, and choice and sets them in `answers`

## `scorePlayer` (qn: number, data: QuizQuestion)

takes in a question number and quiz question in order to score the user's answer for that particular question

## `initScore` (qn: number, qPoints: number, qTime: number)

takes in a question number, question points, and question time and creates a new AnswerObj in `answers`

## `getLeaderboardComponent` ()

returns the user's name, total score, leaderboard position change, if the leaderboard entry is the player's (for display purposes), and all correctly answered question indices

## `getStartData` (qn: number, quiz: Quiz)

takes the quiz number and quiz data and returns the quiz question's question text, answer texts, the time allocated to answering the question, index, the user's name, the user's total score, and the total number of questions in the quiz

## `getEndData` (leaderBoard: LeaderBoard[], qn: number, question: QuizQuestion, totalQuestions: number)

takes the leaderboard, quiz number, quiz questions, and total number of questions and returns the question's correct answers, expanations for each answer choice, the user's total score, the score gained based on answering the question, whether or not the answer was correct, the leaderboard (that sets isSelf to true for display purposes), the user's response time, question's question text, question's answer texts, question index, the user's name, the user's answer choices, and the total number of questions in the quiz

## `addWs` (sock: WebSocket)

takes a WebSocket and adds it to the user's `connection`

## `removeWs` ()

sets WebSocket connectiion to undefined

## `getWs` ()

returns the WebSocket connection

## `kick` (reason: string)

takes a reason, kills the player's WebSocket connection, and sends the reason to the user

## `send` (message: socketData)

takes a message and sends the message through the user's WebSocket connection if connected