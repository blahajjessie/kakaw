import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './mocks/matchMedia.mock';
import { rest } from 'msw';
import { RecoilRoot } from 'recoil';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';
import mockRouter from 'next-router-mock';
import LeaderboardPage from '@/components/LeaderboardPage';

jest.mock('next/router', () => require('next-router-mock'));

const entr = {
	name: 'Baba',
	score: 5,
	positionChange: 0,
	isSelf: false,
};

test('Renders Leaderboard', async () => {
	render(<LeaderboardPage entries={[entr]} index={1} />);
	await screen.findByText('Baba');
});

test('Renders Leaderboard with You', async () => {
    entr.isSelf = true;
	render(<LeaderboardPage entries={[entr]} index={1} />);
	await screen.findByText('You');
});
