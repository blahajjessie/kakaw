# Game Host (teacher) API's

### Join game
POST /games/:gameId/players: join a game
body: {name: string}
response: {ok: boolean, id?: string, err?: string}

### Answer Question
`POST /games/:gameId/questions/:index/answer`: answer a question
body: {userId: string, answer: number} (answer is by index)
response: {ok: boolean, err?: string}
errors are unlikely if everyone behaves, but you could specify the wrong user ID or an invalid question index (especially if you answer too late) or something
