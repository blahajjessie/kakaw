# Frontend Testing Suites

## How to Run

The testing suites can be run on the frontend by using the command:

```bash
npm test
```

inside of the frontend folder. If you want to see console output from the code
or the test suites for debugging, you can use `npm run test-verbose` instead.

All testing suites must be put in the corresponding folder in source.

## General Convention

### Mocking REST APIs

The isolation of frontend components requires testing to separate pages from connecting to the backend, but the API calls 
made by the frontend will then produce errors.  To maintain the isolation while testing these fetch calls, the test suite can 
mock the server functions.

A mock REST API can be created by using the MSW, Mock Service Worker, module.

A mock API endpoint can be created following this framework:

```ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const ENDPOINT = 'http://localhost:8080/ENDPOINT';

const server = setupServer(
	rest.METHOD(ENDPOINT, async (req, res, ctx) => {
        // Operations if desired for differentiation
		return res(ctx.status(CODE), ctx.json(JSON.stringify({ ok: true })));
	})
);
```

When creating a mock API, keep in mind the functionality does not need to be implemented, nor is it the goal of mocking.
The goal is for the fetch calls in the frontend components to receive the responses required for proper testing.

However, even if the test is not involved with frontend API handling, it is good practice for the mock API to be available 
as it will avoid unnecessary errors in the testing suite.
