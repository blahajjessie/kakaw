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

### Test Runner

Tests that can be completed without multiple operation set-up, or at least
little set-up, can use Jest's test function.

Components should be rendered inside of 

```ts
test('Test Name', async () => {
    render(
		<Component />
	);
	await screen.findByText('Text');
});
```

The necessary variables and types can be defined outside of the test calls.

### Screen Searching

To search a component, React-Testing-Library provides a series of callable functions on the screen object.

These functions will only work properly when a component is currently rendered.

#### Text

Searching for static text is primarily important for ensuring a component has rendered, a component receives 
context or parameters correctly, or to wait for a component to re-render upon enacting a change in state.

```ts
await screen.findByText('Text');
```

The findByText function, and all other React-Testing-Library findBy functions, is asynchronous, and should be called along 
with await as shown above.  A failure will result in a timeout on that test.

To operate on components, a getBy function can be utilized.

```ts
const component = screen.getByText('Button');
```

getBy functions are NOT asynchronous and will fail if the required component is not yet rendered.
To ensure stability of a test, a component in the render should by wait on before using a getBy.

```ts
await screen.findByText('Text');
const component = screen.getByText('Button');
```

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
