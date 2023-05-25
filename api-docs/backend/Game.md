



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
