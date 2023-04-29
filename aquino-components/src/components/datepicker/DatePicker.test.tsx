import React, {useRef} from 'react';
import {vi} from 'vitest';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from './DatePicker';
import ExtendedDate from './ExtendedDate';
import MockStateToProps, {type MockStateToPropsRefType} from '@test/mocks/MockStateToProps';
import Root from '@internals/Root';
import {type UserEvent} from '@testing-library/user-event/dist/types/setup/setup';

async function renderDatePicker_(datepicker: JSX.Element): Promise<[HTMLElement, UserEvent]> {
  const user = userEvent.setup();
  render(
    <Root>
      <div>click outside</div>
      {datepicker}
    </Root>,
  );
  const button = screen.getByRole('button');
  await user.click(button);
  return [screen.getByLabelText('weeks panel'), user];
}

async function renderDatePicker(): Promise<[HTMLElement, ExtendedDate, UserEvent]> {
  const date = ExtendedDate.parse('02/02/1990');
  const [panel, user] = await renderDatePicker_(<DatePicker id='test' value={date} onAction={vi.fn()} />);
  return [panel, date, user];
}

async function renderMockedDatePicker(): Promise<[HTMLElement, ExtendedDate, React.RefObject<MockStateToPropsRefType<Nullable<ExtendedDate>>>, UserEvent]> {
  const mockRef = React.createRef<MockStateToPropsRefType<Nullable<ExtendedDate>>>();
  const date = ExtendedDate.parse('02/02/1990');
  const [panel, user] = await renderDatePicker_(
    <MockStateToProps<Nullable<ExtendedDate>> innerRef={mockRef} initialValue={date}>
      {(value, setValue) => <DatePicker id='test' value={value} onAction={setValue} />}
    </MockStateToProps>,
  );
  return [panel, date, mockRef, user];
}

describe('DatePicker Component', () => {
	it('should render content', () => {
		render(<DatePicker id='test' value={ExtendedDate.now()} onAction={vi.fn()} />);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

  it('should change date when typing', async () => {
    const [, value, mockRef, user] = await renderMockedDatePicker();

		const input = screen.getByRole('textbox');

    await act(async () => {
      await user.click(input);
      await user.clear(input);
      await user.type(input, '19800525', {initialSelectionStart: 0, initialSelectionEnd: 0});
    });

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1980-05-25');
    });
	});

  it('should open popover when clicking the button', async () => {
    const user = userEvent.setup();
    render(<DatePicker id='test' value={ExtendedDate.now()} onAction={vi.fn()} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const panel = screen.getByLabelText('weeks panel');
    expect(panel).toBeInTheDocument();
  });
});
