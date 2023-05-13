import { render } from '@testing-library/react';
import './mocks/matchMedia.mock';
import Home from '@/pages/index';
import Upload from '@/pages/upload';
import LeaderboardPage from '@/pages/[gameId]/leaderboard';
import HostQuestionPage from '@/pages/[gameId]/questions/host';
import PlayerQuestionPage from '@/pages/[gameId]/questions/player';
import { screen, waitFor } from '@testing-library/react';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

test('Home', () => {
	render(<Home />);
	waitFor(() => {
		expect(screen.getByRole('link')).not.toBe(null);
	});
});

test('Upload', () => {
	render(<Upload />);
    waitFor(() => {
	    expect(screen.getAllByRole('button')).not.toBe(null);
    });
});

test('Leaderboard', () => {
	mockRouter.push('/55555/leaderboard');
	render(<LeaderboardPage />);
    waitFor(() => {
	    expect(screen.getAllByRole('img')).not.toBe(null);
    });
});

test('Host Questions Page', () => {
	mockRouter.push('/55555/questions/host');
	render(<HostQuestionPage />);
    waitFor(() => {
	    expect(screen.getByRole('main')).not.toBe(null);
    });
});

test('Player Questions Page', () => {
	mockRouter.push('/55555/questions/player');
	render(<PlayerQuestionPage />);
    waitFor(() => {
	    expect(screen.getByRole('main')).not.toBe(null);
    });
});
