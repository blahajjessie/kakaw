import { render } from '@testing-library/react';
import './mocks/matchMedia.mock';
import Home from '@/pages/index';
import Upload from '@/pages/upload';
import LeaderboardPage from '@/pages/[gameId]/leaderboard';
import HostQuestionPage from '@/pages/[gameId]/questions/host';
import PlayerQuestionPage from '@/pages/[gameId]/questions/player';
import PlayerWaiting from '@/components/WaitingPages/PlayerWaiting';
import { screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

test('Home', async () => {
	render(<Home />);
	await screen.findByRole('link');
});

test('Upload', async () => {
	render(<Upload />);
	expect(await screen.findAllByRole('button')).not.toBe(null);
});

test('Leaderboard', async () => {
	mockRouter.push('/55555/leaderboard');
	render(<LeaderboardPage />);
	expect(await screen.findAllByRole('img')).not.toBe(null);
});

test('Host Questions Page', async () => {
	mockRouter.push('/55555/questions/host');
	render(<HostQuestionPage />);
	expect(await screen.findByRole('main')).not.toBe(null);
});

test('Player Questions Page', async () => {
	mockRouter.push('/55555/questions/player');
	render(<PlayerQuestionPage />);
	expect(await screen.findByRole('main')).not.toBe(null);
});

test('Player Waiting', async () => {
	render(<PlayerWaiting />);
	expect(await screen.findByText('You entered a game!')).not.toBe(null);
});
