import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './mocks/matchMedia.mock';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';
import HostWaiting from '@/components/WaitingPages/HostWaiting';
import { playerListContext } from '@/components/Context/ShareContext';

const URL = 'http://localhost:8080/games/55555/questions/0/start';
const badURL = 'http://localhost:8080/games/44444/questions/0/start';

window.alert = jest.fn();

const server = setupServer(
	rest.post(URL, async (req, res, ctx) => {
		return res(ctx.status(201), ctx.json(JSON.stringify({ ok: true })));
	}),
	rest.post(badURL, async (req, res, ctx) => {
		return res(
			ctx.status(404),
			ctx.json(JSON.stringify({ ok: false, err: 'Quiz Does Not Exist' }))
		);
	})
);

beforeAll(() => {
	server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('Host Waiting Renders', async () => {
	render(
		<playerListContext.Provider value={['Player1', 'Player2']}>
			<HostWaiting hostId={'55555'} />
		</playerListContext.Provider>
	);
	await screen.findByText('55555');
	await screen.findByText('Player2');
});

test('Time Set w/Text', async () => {
	render(
		<playerListContext.Provider value={['Player1', 'Player2']}>
			<HostWaiting hostId={'55555'} />
		</playerListContext.Provider>
	);
	const time = screen.getByTestId('time');
	await userEvent.type(time, '420');
});

test('Max Player Set w/Text', async () => {
	render(
		<playerListContext.Provider value={['Player1', 'Player2']}>
			<HostWaiting hostId={'55555'} />
		</playerListContext.Provider>
	);
	const maxPlayer = screen.getByTestId('playerCount');
	await userEvent.type(maxPlayer, '100');
});

test('Host Start Quiz', async () => {
	render(
		<playerListContext.Provider value={['Player1', 'Player2']}>
			<HostWaiting hostId={'55555'} />
		</playerListContext.Provider>
	);
	await userEvent.click(screen.getByText('Start'));
});

test('Host Start Failure', async () => {
    const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
	render(
		<playerListContext.Provider value={['Player1', 'Player2']}>
			<HostWaiting hostId={'44444'} />
		</playerListContext.Provider>
	);
    fireEvent.click(screen.getByRole('button', {name: 'Start'}));
});
