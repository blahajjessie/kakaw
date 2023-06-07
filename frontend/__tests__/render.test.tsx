import { render } from '@testing-library/react';
import './mocks/matchMedia.mock';
import Home from '@/pages/index';
import Upload from '@/pages/upload';
import EditorPage from '@/pages/editor';
import { screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

test('Home', async () => {
	render(<Home code="" />);
	await screen.findByRole('link');
});

test('Upload', async () => {
	render(<Upload />);
	expect(await screen.findAllByRole('button')).not.toBe(null);
});

test('Renders Editor', async () => {
	render(<EditorPage />);
});
