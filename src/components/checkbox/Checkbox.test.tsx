import React from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from './Checkbox';

import MockBooleanStateToProps from '../../test/mocks/MockBooleanStateToProps';

describe('UICheckbox Component', () => {
	it('should render content', () => {
		render(<Checkbox label='checkbox' value={true} />);

		expect(screen.getByText('checkbox')).toBeInTheDocument();
	});

	it('should change value', async () => {
		render(
			<MockBooleanStateToProps initialValue={false}>
				{(value, setValue) => <Checkbox label='checkbox' value={value} onAction={setValue} />}
			</MockBooleanStateToProps>,
		);

		const checkbox = screen.getByRole('checkbox');

		expect(checkbox).not.toBeChecked();

		userEvent.click(checkbox);

		expect(checkbox).toBeChecked();

		userEvent.click(checkbox);

		expect(checkbox).not.toBeChecked();
	});
});
