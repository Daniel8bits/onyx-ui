import React from 'react';
import NumericTextfield from './NumericTextfield';

describe('NumericTextfield Component', () => {
	it('should render content', () => {
		cy.mount(<NumericTextfield />);

    cy.get('input').should('exist');
	});

  it('should let type positive value within closed interval', () => {
		cy.mount(<NumericTextfield label='example' min={-100} max={100} ariaLabel='test' />);
    cy.wait(500);
    cy.get('l%test').as('textbox');

    cy.get('@textbox').realClick();
    cy.get('@textbox').realType('40');

    cy.get('@textbox').should('have.value', '40');
	});

  it('should let type negative value within closed interval', () => {
		cy.mount(<NumericTextfield label='example' min={-100} max={100} ariaLabel='test' />);
    cy.wait(500);
    cy.get('l%test').as('textbox');

    cy.get('@textbox').realClick();
    cy.get('@textbox').realType('-4');

    cy.get('@textbox').should('have.value', '-40');
	});

  it('should not let type value above closed interval', () => {
    cy.mount(<NumericTextfield label='example' min={-100} max={100} ariaLabel='test' />);
    cy.wait(500);
    cy.get('l%test').as('textbox');

    cy.get('@textbox').realClick();
    cy.get('@textbox').realType('400');

    cy.get('@textbox').should('not.have.value', '400');
  });

  it('should not let type value below closed interval', () => {
    cy.mount(<NumericTextfield label='example' min={-100} max={100} ariaLabel='test' />);
    cy.wait(500);
    cy.get('l%test').as('textbox');

    cy.get('@textbox').realClick();
    cy.get('@textbox').realType('-400');

    cy.get('@textbox').should('not.have.value', '-400');
  });

  it('should complete when typing value below positive and greather than 9 interval', () => {
    cy.mount(<NumericTextfield label='example' min={100} ariaLabel='test' />);
    cy.wait(500);
    cy.get('l%test').as('textbox');

    cy.get('@textbox').realClick();
    cy.get('@textbox').realType('4');

    cy.get('@textbox').should('have.value', '400');
  });

  it('should complete when typing value above negative and lesser than -9 interval', () => {
    cy.mount(<NumericTextfield label='example' max={-100} ariaLabel='test' />);
    cy.wait(500);
    cy.get('l%test').as('textbox');

    cy.get('@textbox').realClick();
    cy.get('@textbox').realType('-4');

    cy.get('@textbox').should('have.value', '-400');
  });
});
