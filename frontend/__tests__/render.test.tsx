import {render} from '@testing-library/react';
import './mocks/matchMedia.mock';
import Home from '@/pages/index';
import Upload from '@/pages/upload';
import LeaderboardPage from '@/pages/[gameId]/leaderboard';

test('Home', () => {
    render(<Home />);
});

test('Upload', () => {
    render(<Upload />);
});

test('Leaderboard', () => {
    render(<LeaderboardPage />);
});
