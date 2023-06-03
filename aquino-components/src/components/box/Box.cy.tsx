import React from 'react';
import Box from './Box';

describe('Box Component', () => {
	it('should render content', () => {
		cy.mount(<Box> something </Box>);

		cy.contains('something').last().should('exist');
	});

	it('should run the callback on click', async () => {
		cy.mount(<Box onAction={cy.spy().as('action-callback')}> something </Box>);

		cy.contains('something').last().realClick();

		cy.get('@action-callback').should('have.been.calledOnce');
	});
});
