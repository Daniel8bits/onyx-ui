import React from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Box from './Box';

describe('Box Component', () => {
	it('should render content', () => {
		render(<Box> something </Box>);

		expect(screen.getByText('something')).toBeInTheDocument();
	});

	it('should run the callback on click', async () => {
		const user = userEvent.setup();
		const clickHandler = vi.fn();
		render(<Box onAction={clickHandler}> something </Box>);

		const div = screen.getByText('something');
		await user.click(div);

		expect(clickHandler).toHaveBeenCalledTimes(1);
	});
});
