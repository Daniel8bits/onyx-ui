import React, {useRef} from 'react';
import {vi} from 'vitest';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../DatePicker';
import ExtendedDate from '../ExtendedDate';
import MockStateToProps, {type MockStateToPropsRefType} from '@test/mocks/MockStateToProps';
import {resetPopOverState} from '@test/configs/ZustandConfigs';
import Root from '@internals/Root';

resetPopOverState();

function renderDatePickerWeeks_(datepicker: JSX.Element) {
  render(
    <Root>
      <div>click outside</div>
      {datepicker}
    </Root>,
  );
  const button = screen.getByRole('button');
  userEvent.click(button);
  return screen.getByLabelText('weeks panel');
}

function renderDatePickerWeeks(): [HTMLElement, ExtendedDate] {
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerWeeks_(<DatePicker id='test' value={date} onAction={vi.fn()} />);
  return [panel, date];
}

function renderMockedDatePickerWeeks(): [HTMLElement, ExtendedDate, React.RefObject<MockStateToPropsRefType<Nullable<ExtendedDate>>>] {
  const mockRef = React.createRef<MockStateToPropsRefType<Nullable<ExtendedDate>>>();
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerWeeks_(
    <MockStateToProps<Nullable<ExtendedDate>> innerRef={mockRef} initialValue={date}>
      {(value, setValue) => <DatePicker id='test' value={value} onAction={setValue} />}
    </MockStateToProps>,
  );
  return [panel, date, mockRef];
}

describe('DatePickerWeeks Component', () => {
  it('should render content', () => {
    const [panel] = renderDatePickerWeeks();

    expect(panel).toBeInTheDocument();
  });

  it('should change date when selecting a day of the same month', () => {
    const [, date, mockRef] = renderMockedDatePickerWeeks();
    const textbox = screen.getByRole<HTMLInputElement>('textbox');
    const day2 = screen.getByLabelText('February 2nd, 1990');
    const day3 = screen.getByLabelText('February 3rd, 1990');
    const day4 = screen.getByLabelText('February 4th, 1990');

    expect(day2.children.item(0)).toBeChecked();
    expect(day3.children.item(0)).not.toBeChecked();
    expect(day4.children.item(0)).not.toBeChecked();

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-02-02');
    });

    expect(textbox.value).toBe('1990/02/02');

    userEvent.click(day3);

    expect(day2.children.item(0)).not.toBeChecked();
    expect(day3.children.item(0)).toBeChecked();
    expect(day4.children.item(0)).not.toBeChecked();

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-02-03');
    });

    expect(textbox.value).toBe('1990/02/03');

    userEvent.click(day4);

    expect(day2.children.item(0)).not.toBeChecked();
    expect(day3.children.item(0)).not.toBeChecked();
    expect(day4.children.item(0)).toBeChecked();

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-02-04');
    });

    expect(textbox.value).toBe('1990/02/04');
  });

  it('should change date when selecting a day of the previous month', () => {
    const [, date, mockRef] = renderMockedDatePickerWeeks();
    const textbox = screen.getByRole<HTMLInputElement>('textbox');
    const m2day2month2 = screen.getByLabelText('February 2nd, 1990');
    const m2day30month1 = screen.getByLabelText('January 30th, 1990');

    expect(m2day2month2.children.item(0)).toBeChecked();
    expect(m2day30month1.children.item(0)).not.toBeChecked();

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-02-02');
    });

    expect(textbox.value).toBe('1990/02/02');

    userEvent.click(m2day30month1);

    const m1day30month1 = screen.getByLabelText('January 30th, 1990');

    expect(m2day2month2.children.item(0)).not.toBeChecked();
    expect(m2day30month1.children.item(0)).not.toBeChecked();
    expect(m1day30month1.children.item(0)).toBeChecked();

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-01-30');
    });

    expect(textbox.value).toBe('1990/01/30');

    const m1day31month11 = screen.getByLabelText('December 31st, 1989');

    userEvent.click(m1day31month11);

    const m11day31month11 = screen.getByLabelText('December 31st, 1989');

    expect(m1day30month1.children.item(0)).not.toBeChecked();
    expect(m11day31month11.children.item(0)).toBeChecked();

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1989-12-31');
    });

    expect(textbox.value).toBe('1989/12/31');
  });

  it('should change date when selecting a day of the next month', () => {
    const [, date, mockRef] = renderMockedDatePickerWeeks();
    const textbox = screen.getByRole<HTMLInputElement>('textbox');
    const m2day2month2 = screen.getByLabelText('February 2nd, 1990');
    const m2day7month3 = screen.getByLabelText('March 7th, 1990');

    expect(m2day2month2.children.item(0)).toBeChecked();
    expect(m2day7month3.children.item(0)).not.toBeChecked();

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-02-02');
    });

    expect(textbox.value).toBe('1990/02/02');

    userEvent.click(m2day7month3);

    const m3day7month3 = screen.getByLabelText('March 7th, 1990');

    expect(m2day2month2.children.item(0)).not.toBeChecked();
    expect(m2day7month3.children.item(0)).not.toBeChecked();
    expect(m3day7month3.children.item(0)).toBeChecked();

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-03-07');
    });

    expect(textbox.value).toBe('1990/03/07');

    const m3day5month4 = screen.getByLabelText('April 5th, 1990');

    userEvent.click(m3day5month4);

    const m4day5month4 = screen.getByLabelText('April 5th, 1990');

    expect(screen.queryByLabelText('April 11th, 1990')?.children.item(0)).not.toBeChecked();
    expect(m4day5month4.children.item(0)).toBeChecked();

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-04-05');
    });

    expect(textbox.value).toBe('1990/04/05');
  });

  it('should change selected day when typing a new date', async () => {
    const [, date, mockRef] = renderMockedDatePickerWeeks();

    const date1 = 'February 2nd, 1990';
    const date2 = 'June 16th, 2009';

    const selectedDate = screen.getByLabelText(date1);

    expect(selectedDate.children.item(0)).toBeChecked();
    expect(screen.queryByLabelText(date2)).not.toBeInTheDocument();

    const textbox = screen.getByRole('textbox');

    act(() => {
      userEvent.click(screen.getByText('click outside'));
      userEvent.click(textbox);
      userEvent.clear(textbox);
      userEvent.type(textbox, '20090616', {initialSelectionStart: 0, initialSelectionEnd: 0});
    });

    expect(screen.queryByRole('popover')).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('button'));

    expect(screen.queryByLabelText(date1)).not.toBeInTheDocument();
    expect(screen.getByLabelText(date2).children.item(0)).toBeChecked();
  });
});
