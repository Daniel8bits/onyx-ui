import React from 'react';
import {vi} from 'vitest';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textfield from './Textfield';

describe('Textfield Component', () => {
	it('should render content', () => {
		render(<Textfield />);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('should render label', async () => {
		render(<Textfield label='example' />);

		expect(screen.getByText('example')).toBeInTheDocument();
	});

  it('should show text when typing', async () => {
		const user = userEvent.setup();
    render(<Textfield />);
    
    const str = 'example text';

    const input = screen.getByRole<HTMLInputElement>('textbox');

		await act(async () => {
			await user.type(input, str);
		});

    expect(input.value).toBe(str);
  });
});
