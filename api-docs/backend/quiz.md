# Quiz

### `QuizQuestion` type (json)
- `questionText` (string) : The text to be displayed as the question
- `answerTexts` (string[]): The text of the answer choices
- `correctAnswers` (number[]): The list of correct answers, numeric, corresponding to the array indices of `answerTexts`
- `answerExplain` [optional] (string[]) : A list of strings that explain why each answer choice is correct or incorrect. This has the same length as the answerTexts array. This has not been used or implemented anywhere, but will be later. This either does not exist, or is the length of the number of questions. 
- `note` [optional] (string): A note for debug/internal purposes
- `time` [optional] (number): The time allowed for this question, if different from the default
- `points` [optional] (number): The number of points for this question, if different from the default.

### `Quiz` type (json)
- `meta` (object):
    - `title` (string) : The name of the quiz
    - `author` (string) : The person who made this quiz
    - `pointDefault` (number) : The default number of points for each question, can be overridden by the `points` field on individual questions. 
    - `timeDefault` (number) : The default amount of time for a question, can be overridden by `time` 
    - `note` (string) : for internal purposes only
- `questions` (QuizQuestion[]) : The array of quiz questions


## Game
- users (Map<UserId, User>) : a map of the user Id's and their user objects
- host (UserId): The id of the game host
(Note: this may change to be a more complicated type...)
- `activeQuestion` (number) : the question index that is currently being played
- `quizOpen` (boolean) : Is the question accepting answers?
- `quizData` (Quiz) : The questions for the quiz
I'm thinking of `Map<UserId, {time, answer, correct, score}[]>`
- `answers` (Map <UserId, {time: number, answer:number}>) : A map of the answers received for the question. 



## Users
(note!) This is subject to change as jess changes how quiz grading works... 
- name (string): The display/nickname of the user

(The following will probably be moved to the game object)
- answers: the answers the user has given
- scores: the scores for each answered question. This can be summed to find the users total score, but that is never stored. 
- times: the amount of time that each user spent on each question


## Websocket