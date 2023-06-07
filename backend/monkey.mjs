import WebSocket from 'ws';

const users = 250;
const wsUrl = 'ws://localhost:8080';
const httpUrl = 'http://localhost:8080';

const game = process.argv[2];

const joins = [];
const players = [];

async function joinGame() {
	const response = await (
		await fetch(httpUrl + `/games/${game}/players`, {
			method: 'POST',
			headers: {
				['content-type']: 'application/json',
			},
			body: JSON.stringify({
				username: Math.random().toString(),
			}),
		})
	).json();
	const socket = new WebSocket(
		wsUrl +
			`/connect?gameId=${game}&playerId=${response.id}&token=${response.token}`
	);
	players.push({
		id: response.id,
		token: response.token,
		socket,
	});

	socket.onmessage = (e) => {
		const body = JSON.parse(e.data);
		if (body.type == 'startQuestion') {
			const waitTime = Math.random() * (body.time - 1000);
			const answer = Math.floor(Math.random() * body.answerTexts.length);
			setTimeout(async () => {
				await (
					await fetch(
						httpUrl + `/games/${game}/questions/${body.index}/answer`,
						{
							method: 'POST',
							headers: {
								['content-type']: 'application/json',
								authorization: `Bearer ${response.token}`,
							},
							body: JSON.stringify({
								userId: response.id,
								answer,
							}),
						}
					)
				).json();
			}, waitTime);
		}
	};
}

for (let i = 0; i < users; i++) {
	joins.push(joinGame());
}

await Promise.all(joins);
