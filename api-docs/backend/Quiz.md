Currently Implemented in `quiz.ts`

# `QuizValidate` function

Validates json to figure out if its a quiz. Throws an error if the json is invalid.

# `Quiz` Class

- `meta`: The same as it is in json. The interface for this is called `QuizQuestion`
- `questions` (QuizQuestion[]) : The array of quiz questions, as reflected in json. The interface for this is called `QuizMeta`

## `getName` ()

takes in a question number, returns the title of the quiz

## `getQuestionData` (qn: number)

takes in a question number (`qn`), returns the data for that question as a `QuizQuestion` object

## `getAnswers` (qn: number)

takes in a question number, returns the answer choice options as an array of numbers

## `getQuestionTime` (qn: number)

returns the amount of time (in _seconds_) for the question, or the default if it does not exist

## `getPoints` (qn: number)

takes in a question number and returns the question's dedicated number of points if it exists, otherwise returns the default number of points

## `getQuestionCount` ()

returns the total number of questions in the quiz
