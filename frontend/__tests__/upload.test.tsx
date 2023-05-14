import { render } from '@testing-library/react';
import { screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './mocks/matchMedia.mock';
import Upload from '@/pages/upload';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import mockRouter from 'next-router-mock';
import 'whatwg-fetch';

const URL = 'http://localhost:8080/games';

const server = setupServer(
	rest.post(URL, async (req, res, ctx) => {
		return res(
			ctx.status(201),
			ctx.json(JSON.stringify({ hostId: 55555, gameId: 55555 }))
		);
	})
);

beforeAll(() => {
	server.listen();
});

afterEach(() => server.resetHandlers())

afterAll(() => server.close());

jest.mock('next/router', () => require('next-router-mock'));

const file = new File([JSON.stringify({ hello: 'bro' })], 'test.json', {
	type: 'application/JSON',
});

const wrongFile = new File(['Hi'], 'test.text', {
	type: 'text',
});

test('Upload - No File Selected', async () => {
	render(<Upload />);
	expect(await screen.findAllByRole('button')).not.toBe(null);
	userEvent.click(screen.getByText('Upload'));
	// Currently does nothing on failure
});

test('Upload - File Selection', async () => {
	render(<Upload />);
	expect(await screen.findAllByRole('button')).not.toBe(null);
	const uploadInput = screen.getByTestId('upload');
	fireEvent.change(uploadInput, { target: { files: [file] } });
	const fileTitle = await screen.findByText('test.json');
	expect(fileTitle).not.toBe(null);
});

test('Upload - Wrong File Type', async () => {
	render(<Upload />);
	expect(await screen.findAllByRole('button')).not.toBe(null);
	const uploadInput = screen.getByTestId('upload');
	fireEvent.change(uploadInput, { target: { files: [wrongFile] } });

	// Currently displays nothing when uploading the wrong file
	const fileTitle = screen.queryByText('test.text');
	expect(fileTitle).toBeNull();
});

test('Upload File', async () => {
	mockRouter.push('/upload');
	render(<Upload />);
	expect(await screen.findAllByRole('button')).not.toBe(null);
	const uploadInput = screen.getByTestId('upload');
	fireEvent.change(uploadInput, { target: { files: [file] } });
	const fileTitle = await screen.findByText('test.json');
	expect(fileTitle).not.toBe(null);
	userEvent.click(screen.getByText('Upload'));
	await screen.findByText('Uploading...');
});
