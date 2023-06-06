import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './mocks/matchMedia.mock';
import { rest } from 'msw';
import { RecoilRoot } from 'recoil';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';
import mockRouter from 'next-router-mock';
import Home from '@/pages/index';

const URL = 'http://localhost:8080/games/55555/players';

jest.mock('next/router', () => require('next-router-mock'));

const server = setupServer(
	rest.post(URL, async (req, res, ctx) => {
		return res(ctx.status(201), ctx.json({ id: '3452', token: '55555' }));
	})
);

beforeAll(() => {
	server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('Renders Home', async () => {
	render(
		<RecoilRoot>
			<Home code="55555" />
		</RecoilRoot>
	);
	await screen.findByText('Host your own Quiz!');
});

test('Failure / No Name Entered', async () => {
	render(
		<RecoilRoot>
			<Home code="55555" />
		</RecoilRoot>
	);
	await screen.findByText('Host your own Quiz!');
	fireEvent.click(screen.getByText('Join'));
	expect(sessionStorage.getItem(`kakawToken/55555/3452`)).toBe(null);
});

test('Failure / Text Code Entered', async () => {
	render(
		<RecoilRoot>
			<Home code="" />
		</RecoilRoot>
	);
	await screen.findByText('Host your own Quiz!');
	const code = screen.getByPlaceholderText('Code');
	await userEvent.type(code, 'Jorge');
	const name = screen.getByPlaceholderText('Username');
	await userEvent.type(name, 'Jorge');
	fireEvent.click(screen.getByText('Join'));
});

test('Join A Quiz', async () => {
	render(
		<RecoilRoot>
			<Home code="55555" />
		</RecoilRoot>
	);
	await screen.findByText('Host your own Quiz!');
	const name = screen.getByPlaceholderText('Username');
	await userEvent.type(name, 'Jorge');
	fireEvent.click(screen.getByText('Join'));
	await waitFor(() => {
		expect(sessionStorage.getItem(`kakawToken/55555/3452`)).not.toBe(null);
	});
});
