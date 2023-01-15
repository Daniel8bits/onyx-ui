import React from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

describe('Card Component', () => {
	it('should render content', () => {
		render(<Card> something </Card>);

		expect(screen.getByText('something')).toBeInTheDocument();
	});

	it('should render image', () => {
		render(<Card image='/assets/img.png' title='titulo'> something </Card>);

		expect(screen.getByAltText('titulo')).toBeInTheDocument();
	});

	it('should render title', () => {
		render(<Card title='titulo'> something </Card>);

		expect(screen.getByText('titulo')).toBeInTheDocument();
	});

	it('should run the callback on click', async () => {
		const clickHandler = vi.fn();
		render(<Card onClick={clickHandler}> something </Card>);

		const card = screen.getByText('something');
		userEvent.click(card);

		expect(clickHandler).toHaveBeenCalledTimes(1);
	});
});
