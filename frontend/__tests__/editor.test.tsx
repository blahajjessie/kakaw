import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './mocks/matchMedia.mock';
import { rest } from 'msw';
import { RecoilRoot } from 'recoil';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';
import mockRouter from 'next-router-mock';
import EditorPage from '@/pages/editor';

jest.mock('next/router', () => require('next-router-mock'));

test('Renders Editor', async () => {
	render(<EditorPage />);
});
