# Game Types Documentation

# Game Type dependencies (Probably going to get spun off, again)

## Simple definitions
- `UserId` : String 
- `GameId` : String

## Answer
### Data Types
- `time` : The ammount of time that it took to answer a question
- `answer` : The answer (number) chosen by the user
- `correct` : boolean. 
- `score` : The ammount of score added by this question

### Functions
- `scoreQuestion (answerArray: Array<Number>): void`
input: the arary of correct answers
output: nothing, but the score and `correct` is updated.

