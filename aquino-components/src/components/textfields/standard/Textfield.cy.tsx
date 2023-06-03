import React from 'react';
import Textfield from './Textfield';

describe('Textfield Component', () => {
	it('should render content', () => {
		cy.mount(<Textfield />);

    cy.get('input').should('exist');
	});

	it('should render label', () => {
		cy.mount(<Textfield label='example' />);

    cy.contains('example').should('exist');
	});

  it('should show text when typing', () => {
    cy.mount(<Textfield />);
    
    const str = 'example text';

    cy.get('input').realClick();
    cy.get('input').realType(str);
    
    cy.get('input').should('have.value', str);
  });
});
