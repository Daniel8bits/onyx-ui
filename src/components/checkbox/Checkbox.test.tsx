import React from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from './Checkbox';

import MockStateToProps from '../../test/mocks/MockStateToProps';

describe('UICheckbox Component', () => {
	it('should render content', () => {
		render(<Checkbox label='checkbox' value={true} />);

		expect(screen.getByText('checkbox')).toBeInTheDocument();
	});

	it('should change value', async () => {
		render(
			<MockStateToProps initialValue={false}>
				{(value, setValue) => <Checkbox label='checkbox' value={value} onAction={setValue} />}
			</MockStateToProps>,
		);

		const checkbox = screen.getByRole('checkbox');
		const label = screen.getByText('checkbox');

		expect(checkbox).not.toBeChecked();

		userEvent.click(label);

		expect(checkbox).toBeChecked();

		userEvent.click(label);

		expect(checkbox).not.toBeChecked();
	});
});
