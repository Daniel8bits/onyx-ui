import React from 'react';
import Card from '.';

describe('Card Component', () => {
	it('should render content', () => {
		cy.mount(<Card> something </Card>);

		cy.contains('something').last().should('exist');
	});

  it('should render image', () => {
		cy.mount(<Card image='/assets/img.png' title='title'> something </Card>);

		cy.get('[alt="title"]').should('exist');
	});

	it('should render title', () => {
		cy.mount(<Card title='title'> something </Card>);

		cy.contains('title').should('exist');
	});

	it('should run the callback on click', async () => {
		cy.mount(<Card onAction={cy.spy().as('action-callback')}> something </Card>);

		cy.contains('something').last().realClick();

		cy.get('@action-callback').should('have.been.calledOnce');
	});
});
