import React, {useRef} from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from './DatePicker';
import ExtendedDate from './ExtendedDate';
import MockStateToProps, {type MockStateToPropsRefType} from '@test/mocks/MockStateToProps';

describe('DatePicker Component', () => {
	it('should render content', () => {
		render(<DatePicker id='test' value={ExtendedDate.now()} onAction={vi.fn()} />);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

  it('should change date when typing', () => {
    const mockRef = React.createRef<MockStateToPropsRefType<Nullable<ExtendedDate>>>();

		render(
      <MockStateToProps<Nullable<ExtendedDate>> innerRef={mockRef} initialValue={ExtendedDate.now()}>
        {(value, setValue) => <DatePicker id='test' value={value} onAction={setValue} />}
      </MockStateToProps>,
    );

		const input = screen.getByRole('textbox');
    userEvent.click(input);
		userEvent.clear(input);
    userEvent.type(input, '19900202', {initialSelectionStart: 0, initialSelectionEnd: 0});

    mockRef.current?.(value => {
      expect(value?.toString()).toBe('1990-02-02');
    });
	});

  it('should open popover when clicking the button', () => {
    render(<DatePicker id='test' value={ExtendedDate.now()} onAction={vi.fn()} />);

    const button = screen.getByRole('button');
    userEvent.click(button);

    const panel = screen.getByLabelText('weeks panel');
    expect(panel).toBeInTheDocument();
  });
});
