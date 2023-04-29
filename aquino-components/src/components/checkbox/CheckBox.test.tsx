import React from 'react';
import {vi} from 'vitest';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckBox from './CheckBox';

import MockStateToProps from '../../test/mocks/MockStateToProps';

describe('UICheckBox Component', () => {
	it('should render content', () => {
		render(<CheckBox label='checkbox' value={true} />);

		expect(screen.getByText('checkbox')).toBeInTheDocument();
	});

	it('should change value', async () => {
		const user = userEvent.setup();
		render(
			<MockStateToProps initialValue={false}>
				{(value, setValue) => <CheckBox label='checkbox' value={value} onAction={setValue} />}
			</MockStateToProps>,
		);

		const {getByRole, getByText} = screen;

		const checkbox = getByRole('checkbox');
		const label = getByText('checkbox');

		expect(checkbox).not.toBeChecked();

		await user.click(label);

		expect(checkbox).toBeChecked();

		await	user.click(label);

		expect(checkbox).not.toBeChecked();
	});
});
