import { render } from '@testing-library/react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './mocks/matchMedia.mock';
import Upload from '@/pages/upload';

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
});
