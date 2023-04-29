import React, {useRef} from 'react';
import {vi} from 'vitest';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../DatePicker';
import ExtendedDate from '../ExtendedDate';
import MockStateToProps, {type MockStateToPropsRefType} from '@test/mocks/MockStateToProps';
import Root from '@internals/Root';
import {resetPopOverState} from '@test/configs/ZustandConfigs';
import {type UserEvent} from '@testing-library/user-event/dist/types/setup/setup';

resetPopOverState();

async function renderDatePickerMonths_(datepicker: JSX.Element, date: ExtendedDate): Promise<[HTMLElement, UserEvent]> {
  const user = userEvent.setup();
  render(
    <Root>
      <div>click outside</div>
      {datepicker}
    </Root>,
  );
  const button = screen.getByRole('button');
  await user.click(button);
  const monthsButton = screen.getByText(`${date.getMonthName()}, ${date.getYear()}`);
  await user.click(monthsButton);
  return [screen.getByLabelText('months panel'), user];
}

async function renderDatePickerMonths(): Promise<[HTMLElement, ExtendedDate, UserEvent]> {
  const date = ExtendedDate.parse('02/02/1990');
  const [panel, user] = await renderDatePickerMonths_(<DatePicker id='test' value={date} onAction={vi.fn()} />, date);
  return [panel, date, user];
}

async function renderMockedDatePickerMonths(): Promise<[HTMLElement, ExtendedDate, React.RefObject<MockStateToPropsRefType<Nullable<ExtendedDate>>>, UserEvent]> {
  const mockRef = React.createRef<MockStateToPropsRefType<Nullable<ExtendedDate>>>();
  const date = ExtendedDate.parse('02/02/1990');
  const [panel, user] = await renderDatePickerMonths_(
    <MockStateToProps<Nullable<ExtendedDate>> innerRef={mockRef} initialValue={date}>
      {(value, setValue) => <DatePicker id='test' value={value} onAction={setValue} />}
    </MockStateToProps>,
    date,
  );
  return [panel, date, mockRef, user];
}

describe('DatePickerMonth Component', () => {
  it('should render content', async () => {
    const [panel] = await renderDatePickerMonths();

    expect(panel).toBeInTheDocument();
  });

  it('should change date when selecting a month', async () => {
    const [, , mockRef, user] = await renderMockedDatePickerMonths();

    const textbox = screen.getByRole<HTMLInputElement>('textbox');

    const february = screen.getByText('February');
    const july = screen.getByText('July');
    
    expect(february.children.item(0)).toBeChecked();
    expect(july.children.item(0)).not.toBeChecked();

    await act(async () => {
      await user.click(july);
    });

    await act(async () => {
      await user.click(screen.getByText('July, 1990'));
    });

    expect(screen.getByText('February').children.item(0)).not.toBeChecked();
    expect(screen.getByText('July').children.item(0)).toBeChecked();
    
    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-07-02');
    });

    expect(textbox.value).toBe('1990/07/02');
  });

  it('should change selected month when typing a new date', async () => {
    const [, , mockRef, user] = await renderMockedDatePickerMonths();

    const textbox = screen.getByRole<HTMLInputElement>('textbox');

    expect(screen.getByText('February').children.item(0)).toBeChecked();
    expect(screen.getByText('July').children.item(0)).not.toBeChecked();

    await act(async () => {
      await user.click(screen.getByText('click outside'));
      await user.click(textbox);
      await user.clear(textbox);
      await user.type(textbox, '19900702', {initialSelectionStart: 0, initialSelectionEnd: 0});
    });

    expect(textbox.value).toBe('1990/07/02');
    
    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-07-02');
    });
    
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });

    expect(screen.getByText('February').children.item(0)).not.toBeChecked();
    expect(screen.getByText('July').children.item(0)).toBeChecked();
  });
});
