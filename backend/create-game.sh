#!/bin/sh

response=$(curl -sX POST --json @test-quizzes/knights-quiz.json localhost:8080/games)
game=$(echo "$response" | jq -r .gameId)
host=$(echo "$response" | jq -r .hostId)

echo "host:   websocat 'ws://localhost:8080/connect?gameId=$game&playerId=$host'"

response=$(curl -sX POST --json '{"username":"ben"}' localhost:8080/games/$game/players)
player=$(echo "$response" | jq -r .id)

echo "player: websocat 'ws://localhost:8080/connect?gameId=$game&playerId=$player'"

websocat "ws://localhost:8080/connect?gameId=$game&playerId=$host" | sed 's/^/  host | /g' &
websocat "ws://localhost:8080/connect?gameId=$game&playerId=$player" | sed 's/^/player | /g' &

wait
