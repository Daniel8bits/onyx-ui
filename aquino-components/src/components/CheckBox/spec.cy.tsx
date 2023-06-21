import React from 'react';
import CheckBox from '.';

import MockStateToProps from '../../test/mocks/MockStateToProps';

describe('UICheckBox Component', () => {
	it('should render content', () => {
		cy.mount(<CheckBox label='checkbox' value={true} />);

		cy.contains('checkbox').should('exist');
	});

	it('should change value', () => {
		cy.mount(
			<MockStateToProps initialValue={false}>
				{(value, setValue) => <CheckBox label='checkbox' value={value ?? false} onAction={setValue} />}
			</MockStateToProps>,
		);

    cy.get('input').should('not.be.checked');

		cy.contains('checkbox').realClick();
		cy.get('input').should('be.checked');

		cy.contains('checkbox').realClick();
		cy.get('input').should('not.be.checked');
	});
});
