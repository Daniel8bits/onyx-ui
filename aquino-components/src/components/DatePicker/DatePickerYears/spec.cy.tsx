import React from 'react';
import DatePicker from '..';
import ExtendedDate from '../common/ExtendedDate';
import MockStateToProps, {type MockStateToPropsRefType} from '@test/mocks/MockStateToProps';
import {resetPopOverState} from '@test/configs/ZustandConfigs';

function renderDatePickerYears_(datepicker: JSX.Element, date: ExtendedDate): () => Cypress.Chainable<JQuery> {
  cy.mount(
    <>
      <div>click outside</div>
      {datepicker}
    </>,
  );
  cy.wait(1000);

  cy.get('button').realClick();
  cy.contains(`${date.getMonthName()}, ${date.getYear()}`).realClick();
  cy.contains(`${date.getYear()}`).realClick();

  return () => cy.get('[aria-label="years panel"]');
}

function renderDatePickerYears(): [(() => Cypress.Chainable<JQuery>), ExtendedDate] {
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerYears_(<DatePicker value={date} onAction={cy.spy()} ariaLabel='test' />, date);
  return [panel, date];
}

function renderMockedDatePickerYears(): [(() => Cypress.Chainable<JQuery>), ExtendedDate, React.RefObject<MockStateToPropsRefType<Nullable<ExtendedDate>>>] {
  const mockRef = React.createRef<MockStateToPropsRefType<Nullable<ExtendedDate>>>();
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerYears_(
    <MockStateToProps<Nullable<ExtendedDate>> innerRef={mockRef} initialValue={date}>
      {(value, setValue) => <DatePicker value={value} onAction={setValue} ariaLabel='test' />}
    </MockStateToProps>,
    date,
  );
  return [panel, date, mockRef];
}

describe('DatePickerYears Component', () => {
  resetPopOverState();

  it('should render content', () => {
    const [panel] = renderDatePickerYears();
    
    panel().should('exist');
  });

  it('should change date when selecting a year', () => {
    const [, , mockRef] = renderMockedDatePickerYears();

    cy.get('l%test').as('textbox');
    cy.contains('1990').children().first().as('1990-radio');
    cy.contains('1973').children().first().as('1973-radio');
    
    cy.get('@1990-radio').should('be.checked');
    cy.get('@1973-radio').should('not.be.checked');

    cy.contains('1973').realClick(); // Goes to months panel
    cy.contains('1973').realClick(); // Returns to years panel

    cy.get('@1990-radio').should('not.be.checked');
    cy.get('@1973-radio').should('be.checked');
    
    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1973-02-02');
    });

    cy.get('@textbox').should('have.value', '1973/02/02');
  });

  it('should change selected year when typing a new date', () => {
    const [, , mockRef] = renderMockedDatePickerYears();

    cy.get('l%test').as('textbox');
    cy.contains('1990').children().first().as('1990-radio');
    cy.contains('1973').children().first().as('1973-radio');

    cy.get('@1990-radio').should('be.checked');
    cy.get('@1973-radio').should('not.be.checked');

    cy.contains('click outside').realClick();
    cy.get('@textbox').realClick();
    const backspaces = Array(10).fill('{backspace}').join('');
    cy.get('@textbox').realType(`${backspaces}19730702`);

    cy.get('@textbox').should('have.value', '1973/07/02');

    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1973-07-02');
    });
    
    cy.get('button').realClick();
    
    cy.get('@1990-radio').should('not.be.checked');
    cy.get('@1973-radio').should('be.checked');
  });
});
