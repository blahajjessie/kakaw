# Backend Testing Suites

## How to Run

The testing suites can be run on the backend by using the command:

```bash
npm test
```

inside of the backend folder. If you want to see console output from the code
or the test suites for debugging, you can use `npm run test-verbose` instead.

All testing suites must be put in the corresponding folder in source.

## General Convention

There are two conventions for creating new tests with Jest in this project.

### Isolated Tests

Tests that can be completed without multiple operation set-up, or at least
little set-up, can use Jest's test function.

```ts
test('Test Name', async () => {
	await request
		.post('/route')
		.send(data)
		.expect(200)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.body).toBeDefined();
			expect(data.body.jsonKey).toBeDefined();
		});
});
```

The necessary variables and types can be defined outside of the test calls.

### Complex Tests

Tests requiring multiple api calls to set-up properly should use Jest's describe
function to wrap their necessary set-up. This includes variables and objects.

```ts
describe('Suite Objective', () => {
	// Set-Up
	let something: string;

	test('Test Name', async () => {
		await request
			.post('/route')
			.send(something)
			.expect(200)
			.then((data) => {
				expect(data).toBeDefined();
				expect(data.body).toBeDefined();
				expect(data.body.jsonKey).toBeDefined();
			});
	});
});
```

### API Tests

RestAPI tests are required to use SuperTest in the testing suite.
All test files should then include the following lines:

```ts
import httpServer from '../server';
import supertest from 'supertest';
let request: supertest.SuperTest<supertest.Test>;

beforeAll(() => {
	request = supertest(httpServer);
});

afterAll((done) => {
	httpServer.close(done);
});
```

All tests making an API call will use the request object.

You can translate an API call using the following framework:

METHOD /PATH
body: REQUEST
response: RESPONSE

```ts
await request
	.METHOD('/PATH')
	.send(REQUEST)
	.expect(RESPONSE_CODE)
	.then((RESPONSE) => {
		expect(RESPONSE).toBeDefined();
		expect(RESPONSE.body).toBeDefined();
		expect(RESPONSE.body.jsonKey).toBeDefined();
	});
```

### WebSocket Tests

Testing websockets requires a bit of puppeting to get right, but there are three
key steps: connection, handling, and closing.

An important function is defined in connect.ts, waitForSocketState to wait for a
socket to open and close.

Connection:

To set-up a new WebSocket, simply create a new WebSocket object with the defined
url and wait for the socket to open.

```ts
ws = new WebSocket(url);
await waitForSocketState(ws, WebSocket.OPEN);
```

Handling:

To handle WebSocket events, use the WebSocket.on convention to handle what you
are expecting. Ensure the variables being used inside are in the scope you wish
to use them.

```ts
ws.on('message', function message(data) {
	serverMessage = JSON.parse(data.toString());
});
```

Any event declaration should be done at the same time as connecting the websocket
to the server.

To check a message, a convention similar to checking API responses will be used:

```ts
expect(serverMessage).toBeDefined();
expect(serverMessage.type).toBeDefined();
expect(serverMessage.type).toStrictEqual('string');
expect(serverMessage.something).toBeDefined();
expect(serverMessage.something).toStrictEqual(100);
```

While tedious, this convention ensures the test will be clear on where in the message
the test failed as well as staying consistent to API response validation.

Closing:

All WebSockets should be closed before the end of a test file, this can be checked
using waitForSocketState.

```ts
ws.close();
await waitForSocketState(ws, WebSocket.CLOSED);
```
