import React from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
	it('should render content', () => {
		render(<Button> something </Button>);

		expect(screen.getByText('something')).toBeInTheDocument();
	});

	it('should run the callback on click', async () => {
		const clickHandler = vi.fn();
		render(<Button onAction={clickHandler}> something </Button>);

		const button = screen.getByText('something');
		userEvent.click(button);

		expect(clickHandler).toHaveBeenCalledTimes(1);
	});
});
