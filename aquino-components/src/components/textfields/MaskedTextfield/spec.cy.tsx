import React from 'react';
import MaskedTextfield from '.';

const mask = '{dddd}/{dd}/{dd}';

describe('MaskedTextfield Component', () => {
	it('should render content', () => {
		cy.mount(<MaskedTextfield mask={mask} />);

    cy.get('input').should('exist');
	});

  it('should let type keys contained in mask', () => {
    cy.mount(<MaskedTextfield mask={mask} ariaLabel='test' />);
    cy.wait(500);

    cy.get('l%test').as('textbox');

    cy.get('@textbox').realClick({position: 'left'});
    cy.get('@textbox').realType('1990');

    cy.get('@textbox').should('have.value', '1990/__/__');

    cy.get('@textbox').realClick({position: 'left'});
    const rightarrows = Array(4).fill('{rightarrow}').join('');
    const backspaces = Array(4).fill('{backspace}').join('');
    cy.get('@textbox').realType(`${rightarrows}${backspaces}20161126`);

    cy.get('@textbox').should('have.value', '2016/11/26');
  });

  it('should not let type keys not contained in mask', () => {
    cy.mount(<MaskedTextfield mask={mask} ariaLabel='test' />);
    cy.wait(500);

    cy.get('l%test').as('textbox');

    cy.get('@textbox').realClick({position: 'left'});
    cy.get('@textbox').realType('1a');

    cy.get('@textbox').should('not.have.value', '1a__/__/__');
    cy.get('@textbox').should('have.value', '1___/__/__');
  });
});
