import React, {useRef} from 'react';
import DatePicker from './DatePicker';
import ExtendedDate from './ExtendedDate';
import MockStateToProps, {type MockStateToPropsRefType} from '@test/mocks/MockStateToProps';

function renderDatePicker_(datepicker: JSX.Element): () => Cypress.Chainable<JQuery> {
  cy.mount(
    <>
      <div>click outside</div>
      {datepicker}
    </>,
  );
  cy.get('button').realClick();
  return () => cy.get('[aria-label="weeks panel"]');
}

function renderDatePicker(): [(() => Cypress.Chainable<JQuery>), ExtendedDate] {
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePicker_(<DatePicker value={date} onAction={cy.spy()} />);
  return [panel, date];
}

function renderMockedDatePicker(): [(() => Cypress.Chainable<JQuery>), ExtendedDate, React.RefObject<MockStateToPropsRefType<Nullable<ExtendedDate>>>] {
  const mockRef = React.createRef<MockStateToPropsRefType<Nullable<ExtendedDate>>>();
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePicker_(
    <MockStateToProps<Nullable<ExtendedDate>> innerRef={mockRef} initialValue={date}>
      {(value, setValue) => <DatePicker value={value} onAction={setValue} />}
    </MockStateToProps>,
  );
  return [panel, date, mockRef];
}

describe('DatePicker Component', () => {
	it('should render content', () => {
		cy.mount(<DatePicker id='test' value={ExtendedDate.now()} onAction={cy.spy()} />);

    cy.get('input').should('exist');
	});

  it('should change date when typing', () => {
    const [, value, mockRef] = renderMockedDatePicker();

    const backspaces = Array(10).fill('{backspace}').join('');
    cy.get('input').realType(`${backspaces}19800525`);

    mockRef.current?.(value => {
      cy.wrap(value?.toString()).should('eq', '1980-05-25');
    });
	});

  it('should open popover when clicking the button', () => {
    cy.mount(<DatePicker value={ExtendedDate.now()} onAction={cy.spy()} />);

    cy.get('button').realClick();

    cy.get('[aria-label="weeks panel"]').should('exist');
  });
});
