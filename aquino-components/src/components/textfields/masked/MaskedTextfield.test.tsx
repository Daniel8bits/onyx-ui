import React from 'react';
import {vi} from 'vitest';
import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MaskedTextfield from './MaskedTextfield';

const mask = '{dddd}/{dd}/{dd}';

describe('MaskedTextfield Component', () => {
	it('should render content', () => {
		render(<MaskedTextfield mask={mask} />);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

  it('should let type keys contained in mask', async () => {
    const user = userEvent.setup();
    render(<MaskedTextfield mask={mask} />);

    const input = screen.getByRole<HTMLInputElement>('textbox');

    await act(async () => {
      await user.click(input);
      await user.type(input, '1990', {initialSelectionStart: 0, initialSelectionEnd: 0});  
    });

    expect(input.value).toBe('1990/__/__');

    await act(async () => {
      await user.clear(input);
      await user.type(input, '20161126', {initialSelectionStart: 0, initialSelectionEnd: 0});
    });

    expect(input.value).toBe('2016/11/26');
  });

  it('should not let type keys not contained in mask', async () => {
    const user = userEvent.setup();
    render(<MaskedTextfield mask={mask} />);

    const input = screen.getByRole<HTMLInputElement>('textbox');

    await act(async () => {
      await user.click(input);
      await user.type(input, '1a', {initialSelectionStart: 0, initialSelectionEnd: 0});  
    });

    expect(input.value).not.toBe('1a__/__/__');
    expect(input.value).toBe('1___/__/__');
  });
});
