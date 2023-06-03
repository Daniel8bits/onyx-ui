import React from 'react';
import ComboBox from './ComboBox';

const items = [
  {value: '0', label: 'cachorro'},
  {value: '1', label: 'gato'},
  {value: '2', label: 'galinha'},
  {value: '3', label: 'pato'},
  {value: '4', label: 'lagarto'},
  {value: '5', label: 'jacaré'},
];

const categorizedItems = {
  mamiferos: [
    {value: '0', label: 'cachorro'},
    {value: '1', label: 'gato'},
  ],
  aves: [
    {value: '2', label: 'galinha'},
    {value: '3', label: 'pato'},
  ],
  repteis: [
    {value: '4', label: 'lagarto'},
    {value: '5', label: 'jacaré'},
  ],
};

describe('ComboBox Component', () => {
	it('should render content', () => {
		cy.mount(<ComboBox id='test' items={items} value={items[0]} onAction={cy.spy()} />);

		cy.get('input').should('exist');
	});

  it('should render content when categorized', () => {
		cy.mount(<ComboBox id='test' items={categorizedItems} value={categorizedItems.mamiferos[0]} onAction={cy.spy()} />);

		cy.get('input').should('exist');
	});
  
  it('should open the popover', () => {
		cy.mount(
      <>
        <ComboBox id='test' items={items} value={items[0]} onAction={cy.spy()} />
        <div> click outside </div>
      </>,
    );

    cy.get('input').realClick();

    cy.contains('cachorro').last().should('exist');
    cy.contains('gato').last().should('exist');
    cy.contains('galinha').last().should('exist');
    cy.contains('pato').last().should('exist');
    cy.contains('lagarto').last().should('exist');
    cy.contains('jacaré').last().should('exist');

    cy.contains('click outside').last().realClick();

    cy.contains('cachorro').should('not.exist');
    cy.contains('gato').should('not.exist');
    cy.contains('galinha').should('not.exist');
    cy.contains('pato').should('not.exist');
    cy.contains('lagarto').should('not.exist');
    cy.contains('jacaré').should('not.exist');
	});

  it('should open the popover when categorized', () => {
		cy.mount(
      <>
        <ComboBox id='test' items={categorizedItems} value={categorizedItems.mamiferos[0]} onAction={cy.spy()} />
        <div> click outside </div>
      </>,
    );

		cy.get('input').realClick();

    cy.contains('mamiferos').last().should('exist');
    cy.contains('cachorro').last().should('exist');
    cy.contains('gato').last().should('exist');

    cy.contains('aves').last().should('exist');
    cy.contains('galinha').last().should('exist');
    cy.contains('pato').last().should('exist');

    cy.contains('repteis').last().should('exist');
    cy.contains('lagarto').last().should('exist');
    cy.contains('jacaré').last().should('exist');

    cy.contains('click outside').last().realClick();

    cy.contains('mamiferos').should('not.exist');
    cy.contains('cachorro').should('not.exist');
    cy.contains('gato').should('not.exist');

    cy.contains('aves').should('not.exist');
    cy.contains('galinha').should('not.exist');
    cy.contains('pato').should('not.exist');

    cy.contains('repteis').should('not.exist');
    cy.contains('lagarto').should('not.exist');
    cy.contains('jacaré').should('not.exist');
	});

  it('should search items', () => {
		cy.mount(<ComboBox id='test' items={items} value={items[0]} onAction={cy.spy()} allowSearch />);

    cy.get('input').realClick();
    const backspaces = Array(items[0].label.length).fill('{backspace}').join('');
    cy.get('input').realType(`${backspaces}ga`);

    cy.contains('gato').last().should('exist');
    cy.contains('galinha').last().should('exist');
    cy.contains('pato').should('not.exist');
	});
});
