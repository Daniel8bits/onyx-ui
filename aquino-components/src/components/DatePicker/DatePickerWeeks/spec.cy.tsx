import React, {useRef} from 'react';
import DatePicker from '..';
import ExtendedDate from '../common/ExtendedDate';
import MockStateToProps, {type MockStateToPropsRefType} from '@test/mocks/MockStateToProps';
import {resetPopOverState} from '@test/configs/ZustandConfigs';

function renderDatePickerWeeks_(datepicker: JSX.Element): () => Cypress.Chainable<JQuery> {
  cy.mount(
    <>
      <div>click outside</div>
      {datepicker}
    </>,
  );
  cy.get('button').realClick();
  return () => cy.get('[aria-label="weeks panel"]');
}

function renderDatePickerWeeks(): [(() => Cypress.Chainable<JQuery>), ExtendedDate] {
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerWeeks_(<DatePicker value={date} onAction={cy.spy()} ariaLabel='test' />);
  return [panel, date];
}

function renderMockedDatePickerWeeks(): [(() => Cypress.Chainable<JQuery>), ExtendedDate, React.RefObject<MockStateToPropsRefType<Nullable<ExtendedDate>>>] {
  const mockRef = React.createRef<MockStateToPropsRefType<Nullable<ExtendedDate>>>();
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerWeeks_(
    <MockStateToProps<Nullable<ExtendedDate>> innerRef={mockRef} initialValue={date}>
      {(value, setValue) => <DatePicker value={value} onAction={setValue} ariaLabel='test' />}
    </MockStateToProps>,
  );
  return [panel, date, mockRef];
}

describe('DatePickerWeeks Component', () => {
  resetPopOverState();

  it('should render content', () => {
    const [panel] = renderDatePickerWeeks();

    cy.get('button').realClick();
    panel().should('exist');
  });

  it('should change date when selecting a day of the same month', () => {
    const [, date, mockRef] = renderMockedDatePickerWeeks();
    cy.get('l%test').as('textbox');
    cy.get('l%February 2nd, 1990').as('day2');
    cy.get('l%February 3rd, 1990').as('day3');
    cy.get('l%February 4th, 1990').as('day4');
    cy.get('@day2').children().first().as('day2-radio');
    cy.get('@day3').children().first().as('day3-radio');
    cy.get('@day4').children().first().as('day4-radio');

    cy.get('@day2-radio').should('be.checked');
    cy.get('@day3-radio').should('not.be.checked');
    cy.get('@day4-radio').should('not.be.checked');

    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-02-02');
    });

    cy.get('@textbox').should('have.value', '1990/02/02');

    cy.get('@day3').realClick();

    cy.get('@day2-radio').should('not.be.checked');
    cy.get('@day3-radio').should('be.checked');
    cy.get('@day4-radio').should('not.be.checked');

    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-02-03');
    });

    cy.get('@textbox').should('have.value', '1990/02/03');

    cy.get('@day4').realClick();

    cy.get('@day2-radio').should('not.be.checked');
    cy.get('@day3-radio').should('not.be.checked');
    cy.get('@day4-radio').should('be.checked');

    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-02-04');
    });

    cy.get('@textbox').should('have.value', '1990/02/04');
  });

  it('should change date when selecting a day of the previous month', () => {
    const [, date, mockRef] = renderMockedDatePickerWeeks();
    cy.get('l%test').as('textbox');
    cy.get('l%February 2nd, 1990').as('2/2/1990');
    cy.get('l%January 30th, 1990').as('1/30/1990');
    cy.get('@2/2/1990').children().first().as('2/2/1990-radio');
    cy.get('@1/30/1990').children().first().as('1/30/1990-radio');

    cy.get('@2/2/1990-radio').should('be.checked');
    cy.get('@1/30/1990-radio').should('not.be.checked');

    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-02-02');
    });

    cy.get('@textbox').should('have.value', '1990/02/02');

    cy.get('@1/30/1990').realClick();

    cy.get('@2/2/1990-radio').should('not.be.checked');
    cy.get('@1/30/1990-radio').should('be.checked');

    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-01-30');
    });

    cy.get('@textbox').should('have.value', '1990/01/30');

    cy.get('l%December 31st, 1989').as('12/31/1989');
    cy.get('@12/31/1989').children().first().as('12/31/1989-radio');
    
    cy.get('@12/31/1989').realClick();
    
    cy.get('l%January 1st, 1990').as('1/1/1990');
    cy.get('@1/1/1990').children().first().as('1/1/1990-radio');

    cy.get('@1/1/1990-radio').should('not.be.checked');
    cy.get('@12/31/1989-radio').should('be.checked');

    mockRef.current?.(value => {
      cy.wrap(value?.toString()).should('eq', '1989-12-31');
    });

    cy.get('@textbox').should('have.value', '1989/12/31');
  });

  it('should change date when selecting a day of the next month', () => {
    const [, date, mockRef] = renderMockedDatePickerWeeks();
    cy.get('l%test').as('textbox');
    cy.get('l%February 2nd, 1990').as('2/2/1990');
    cy.get('l%March 7th, 1990').as('3/7/1990');
    cy.get('@2/2/1990').children().first().as('2/2/1990-radio');
    cy.get('@3/7/1990').children().first().as('3/7/1990-radio');

    cy.get('@2/2/1990-radio').should('be.checked');
    cy.get('@3/7/1990-radio').should('not.be.checked');

    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-02-02');
    });

    cy.get('@textbox').should('have.value', '1990/02/02');

    cy.get('@3/7/1990').realClick();

    cy.get('l%March 2nd, 1990').as('3/2/1990');
    cy.get('@3/2/1990').children().first().as('3/2/1990-radio');

    cy.get('@3/2/1990-radio').should('not.be.checked');
    cy.get('@3/7/1990-radio').should('be.checked');

    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-03-07');
    });

    cy.get('@textbox').should('have.value', '1990/03/07');

    cy.get('l%April 5th, 1990').as('4/5/1990');
    cy.get('@4/5/1990').children().first().as('4/5/1990-radio');

    cy.get('@4/5/1990').realClick();

    cy.get('l%April 11th, 1990').as('4/11/1990');
    cy.get('@4/11/1990').children().first().as('4/11/1990-radio');

    cy.get('@4/11/1990-radio').should('not.be.checked');
    cy.get('@4/5/1990-radio').should('be.checked');

    cy.wrap(mockRef).invoke('current', (value: Nullable<ExtendedDate>) => {
      cy.wrap(value?.toString()).should('eq', '1990-04-05');
    });

    cy.get('@textbox').should('have.value', '1990/04/05');
  });

  it('should change selected day when typing a new date', () => {
    const [, date, mockRef] = renderMockedDatePickerWeeks();

    cy.get('l%test').as('textbox');
    cy.get('l%February 2nd, 1990').children().first().as('2/2/1990-radio');
    cy.get('l%February 13th, 1990').children().first().as('2/13/1990-radio');

    cy.get('@2/2/1990-radio').should('be.checked');
    cy.get('@2/13/1990-radio').should('not.be.checked');

    cy.contains('click outside').realClick();
    cy.get('@textbox').realClick();
    const backspaces = Array(10).fill('{backspace}').join('');
    cy.get('@textbox').realType(`${backspaces}20090616`);

    cy.get('r%popover').should('not.exist');

    cy.get('button').realClick().wait(50);

    cy.get('l%June 16th, 2009').children().first().as('6/16/2009-radio');
    cy.get('l%June 5th, 2009').children().first().as('6/5/2009-radio');

    cy.get('@6/16/2009-radio').should('be.checked');
    cy.get('@6/5/2009-radio').should('not.be.checked');
  });
});
