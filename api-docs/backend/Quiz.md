# Quiz

Currently Implimented in `gameTypes.ts`

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

### `QuizValidate` function

