import { render } from '@testing-library/react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './mocks/matchMedia.mock';
import Upload from '@/pages/upload';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const URL = 'http://localhost:8080/games';

const server = setupServer(
	rest.post(URL, async (req, res, ctx) => {
		const quiz = req.json();
		return res(
			ctx.status(201),
			ctx.json(JSON.stringify({ hostId: 55555, gameId: 55555 }))
		);
	})
);

beforeAll(() => {
	server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

jest.mock('next/router', () => require('next-router-mock'));

const file = new File([JSON.stringify({ hello: 'bro' })], 'test.json', {
	type: 'application/JSON',
});

test('Upload - No File Selected', () => {
	render(<Upload />);
	waitFor(() => {
		expect(screen.getAllByRole('button')).not.toBe(null);
	});
	userEvent.click(screen.getByText('Upload Quiz'));
	// Currently does nothing on failure
});

test('Upload - File Selection', () => {
	render(<Upload />);
	waitFor(() => {
		expect(screen.getAllByRole('button')).not.toBe(null);
	});
	const uploadInput = screen.getByTestId('upload');
	fireEvent.change(uploadInput, { target: { files: [file] } });
	userEvent.click(screen.getByText('Upload'));
});
