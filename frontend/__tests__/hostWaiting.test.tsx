import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './mocks/matchMedia.mock';
import { rest } from 'msw';
import { RecoilRoot } from 'recoil';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';
import mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import HostWaiting from '@/components/WaitingPages/HostWaiting';
import Canvas from 'canvas';

const URL = 'http://localhost:8080/games/55555/questions/0/start';

jest.mock('next/router', () => require('next-router-mock'));

const server = setupServer(
	rest.post(URL, async (req, res, ctx) => {
		return res(ctx.status(201), ctx.json({ ok: true }));
	})
);

mockRouter.useParser(createDynamicRouteParser(['/host/[gameId]/[playerId]']));

beforeAll(() => {
	server.listen();
	mockRouter.push('/host/55555/67676');
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('Host Waiting Renders', async () => {
	render(
		<RecoilRoot>
			<HostWaiting />
		</RecoilRoot>
	);
	await screen.findByText('55555');
});

test('Host Start Quiz', async () => {
	render(
		<RecoilRoot>
			<HostWaiting />
		</RecoilRoot>
	);
	await userEvent.click(screen.getByText('Start'));
});
