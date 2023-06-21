import React from 'react';
import Button from '.';

describe('Button Component', () => {
	it('should render content', () => {
		cy.mount(<Button> something </Button>);

		cy.contains('something').last().should('exist');
	});

	it('should run the callback on click', async () => {
		cy.mount(<Button onAction={cy.spy().as('action-callback')}> something </Button>);

		cy.contains('something').last().realClick();

		cy.get('@action-callback').should('have.been.calledOnce');
	});
});
