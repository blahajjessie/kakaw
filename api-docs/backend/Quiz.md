Currently Implimented in `quiz.ts`

# `Quiz` Class
- `meta`: The same as it is in json
- `questions` (QuizQuestion[]) : The array of quiz questions



## `QuizValidate` function
Validates json to fiugre out if its a quiz

## `getName` ()
takes in a question number, returns the title of the quiz

## `getQuestionData` (qn: number)
takes in a question number, returns the data for that question

## `getAnswers` (qn: number)
takes in a question number, returns the answer choice options

## `getQuestionTime` (qn: number)
returns the amount of time for the question, or the default if it does not exist

## `getPoints` (qn: number)
takes in a question number, returns the amount of points for the question, or the default if it is not defined

## `getQuestionMessage` (qn: number)
returns the `BeginResp` for the question, to be sent to users when the question starts


