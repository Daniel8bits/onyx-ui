import React from 'react';
import DatePicker from '..';
import ExtendedDate from '../common/ExtendedDate';
import MockStateToProps, {type MockStateToPropsRefType} from '@test/mocks/MockStateToProps';
import {resetPopOverState} from '@test/configs/ZustandConfigs';

function renderDatePickerMonths_(datepicker: JSX.Element, date: ExtendedDate): () => Cypress.Chainable<JQuery> {
  cy.mount(
    <>
      <div>click outside</div>
      {datepicker}
    </>,
  );
  cy.wait(1000);

  cy.get('button').realClick();
  cy.contains(`${date.getMonthName()}, ${date.getYear()}`).realClick();

  return () => cy.get('[aria-label="months panel"]');
}

function renderDatePickerMonths(): [(() => Cypress.Chainable<JQuery>), ExtendedDate] {
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerMonths_(<DatePicker value={date} onAction={cy.spy()} ariaLabel='test' />, date);
  return [panel, date];
}

function renderMockedDatePickerMonths(): [(() => Cypress.Chainable<JQuery>), ExtendedDate, React.RefObject<MockStateToPropsRefType<Nullable<ExtendedDate>>>] {
  const mockRef = React.createRef<MockStateToPropsRefType<Nullable<ExtendedDate>>>();
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerMonths_(
    <MockStateToProps<Nullable<ExtendedDate>> innerRef={mockRef} initialValue={date}>
      {(value, setValue) => <DatePicker value={value} onAction={setValue} ariaLabel='test' />}
    </MockStateToProps>,
    date,
  );
  return [panel, date, mockRef];
}

describe('DatePickerMonths Component', () => {
  resetPopOverState();

  it('should render content', () => {
    const [panel] = renderDatePickerMonths();

    panel().should('exist');
  });

  it('should change date when selecting a month', () => {
    const [, , mockRef] = renderMockedDatePickerMonths();

    cy.get('l%test').as('textbox');
    cy.contains('February').as('feb');
    cy.contains('July').as('jul');
    cy.get('@feb').children().first().as('feb-radio');
    cy.get('@jul').children().first().as('jul-radio');
    
    cy.get('@feb-radio').should('be.checked');
    cy.get('@jul-radio').should('not.be.checked');

    cy.get('@jul').realClick();

    cy.contains('July, 1990').realClick();

    cy.get('@feb-radio').should('not.be.checked');
    cy.get('@jul-radio').should('be.checked');
    
    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-07-02');
    });

    cy.get('@textbox').should('have.value', '1990/07/02');
  });

  it('should change selected month when typing a new date', () => {
    const [, , mockRef] = renderMockedDatePickerMonths();

    cy.get('l%test').as('textbox');
    cy.contains('February').as('feb');
    cy.contains('July').as('jul');
    cy.get('@feb').children().first().as('feb-radio');
    cy.get('@jul').children().first().as('jul-radio');
    
    cy.get('@feb-radio').should('be.checked');
    cy.get('@jul-radio').should('not.be.checked');

    cy.contains('click outside').realClick();
    cy.get('@textbox').realClick();
    const backspaces = Array(10).fill('{backspace}').join('');
    cy.get('@textbox').realType(`${backspaces}19900702`);

    cy.get('@textbox').should('have.value', '1990/07/02');
    
    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-07-02');
    });

    cy.get('button').realClick();

    cy.get('@feb-radio').should('not.be.checked');
    cy.get('@jul-radio').should('be.checked');
  });
});
