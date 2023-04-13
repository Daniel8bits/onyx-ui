import React, {useRef} from 'react';
import {vi} from 'vitest';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../DatePicker';
import ExtendedDate from '../ExtendedDate';
import MockStateToProps, {type MockStateToPropsRefType} from '@test/mocks/MockStateToProps';
import Root from '@internals/Root';
import {resetPopOverState} from '@test/configs/ZustandConfigs';

resetPopOverState();

function renderDatePickerYears_(datepicker: JSX.Element, date: ExtendedDate) {
  render(
    <Root>
      <div>click outside</div>
      {datepicker}
    </Root>,
  );
  const button = screen.getByRole('button');
  userEvent.click(button);
  const monthsButton = screen.getByText(`${date.getMonthName()}, ${date.getYear()}`);
  userEvent.click(monthsButton);
  const yearsButton = screen.getByText(`${date.getYear()}`);
  userEvent.click(yearsButton);
  return screen.getByLabelText('years panel');
}

function renderDatePickerYears(): [HTMLElement, ExtendedDate] {
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerYears_(<DatePicker id='test' value={date} onAction={vi.fn()} />, date);
  return [panel, date];
}

function renderMockedDatePickerYears(): [HTMLElement, ExtendedDate, React.RefObject<MockStateToPropsRefType<Nullable<ExtendedDate>>>] {
  const mockRef = React.createRef<MockStateToPropsRefType<Nullable<ExtendedDate>>>();
  const date = ExtendedDate.parse('02/02/1990');
  const panel = renderDatePickerYears_(
    <MockStateToProps<Nullable<ExtendedDate>> innerRef={mockRef} initialValue={date}>
      {(value, setValue) => <DatePicker id='test' value={value} onAction={setValue} />}
    </MockStateToProps>,
    date,
  );
  return [panel, date, mockRef];
}

describe('DatePickerYears Component', () => {
  it('should render content', () => {
    const [panel] = renderDatePickerYears();

    expect(panel).toBeInTheDocument();
  });

  it('should change date when selecting a year', () => {
    const [, , mockRef] = renderMockedDatePickerYears();

    const textbox = screen.getByRole<HTMLInputElement>('textbox');

    const y1990 = screen.getByText('1990');
    const y1973 = screen.getByText('1973');
    
    expect(y1990.children.item(0)).toBeChecked();
    expect(y1973.children.item(0)).not.toBeChecked();

    act(() => {
      userEvent.click(y1973);
    });

    act(() => {
      userEvent.click(screen.getByText('1973'));
    });

    expect(screen.getByText('1990').children.item(0)).not.toBeChecked();
    expect(screen.getByText('1973').children.item(0)).toBeChecked();
    
    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1973-02-02');
    });

    expect(textbox.value).toBe('1973/02/02');
  });

  it('should change selected year when typing a new date', async () => {
    const [, , mockRef] = renderMockedDatePickerYears();

    const textbox = screen.getByRole<HTMLInputElement>('textbox');

    expect(screen.getByText('1990').children.item(0)).toBeChecked();
    expect(screen.getByText('1973').children.item(0)).not.toBeChecked();

    act(() => {
      userEvent.click(screen.getByText('click outside'));
      userEvent.click(textbox);
      userEvent.clear(textbox);
      userEvent.type(textbox, '19730702', {initialSelectionStart: 0, initialSelectionEnd: 0});
    });

    expect(textbox.value).toBe('1973/07/02');
    
    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1973-07-02');
    });
    
    act(() => {
      userEvent.click(screen.getByRole('button'));
    });

    expect(screen.getByText('1990').children.item(0)).not.toBeChecked();
    expect(screen.getByText('1973').children.item(0)).toBeChecked();
  });
});
