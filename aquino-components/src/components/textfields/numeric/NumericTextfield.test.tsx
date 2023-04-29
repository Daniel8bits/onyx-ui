import React from 'react';
import {vi} from 'vitest';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumericTextfield from './NumericTextfield';
import Root from '@internals/Root';

/*
  - render content
  - let type value within closed interval
  - not let type value below closed interval
  - not let type value above closed interval
  - complete when typing value below positive and greather than 9 interval
  - complete when typing value below negative and lesser than -9 interval
*/

describe('NumericTextfield Component', () => {
	it('should render content', () => {
		render(<NumericTextfield />);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('should let type positive value within closed interval', async () => {
    const user = userEvent.setup();
		render(<Root><NumericTextfield label='example' min={-100} max={100} /></Root>);

    const input = () => screen.getByRole<HTMLInputElement>('textbox');

    await act(async () => {
      await user.type(input(), '40');
    });

		expect(input().value).toBe('40');
	});

  it('should let type negative value within closed interval', async () => {
    const user = userEvent.setup();
		render(<Root><NumericTextfield label='example' min={-100} max={100} /></Root>);

    const input = () => screen.getByRole<HTMLInputElement>('textbox');

    await act(async () => {
      await user.type(input(), '-4');
    });

		expect(input().value).toBe('-40');
	});

  it('should not let type value above closed interval', async () => {
    const user = userEvent.setup();
    render(<NumericTextfield label='example' min={-100} max={100} />);

    const input = screen.getByRole<HTMLInputElement>('textbox');

    await act(async () => {
      await user.type(input, '400');
    });

		expect(input.value).not.toBe('400');
  });

  it('should not let type value below closed interval', async () => {
    const user = userEvent.setup();
    render(<NumericTextfield label='example' min={-100} max={100} />);

    const input = screen.getByRole<HTMLInputElement>('textbox');

    await act(async () => {
      await user.type(input, '-400');
    });

		expect(input.value).not.toBe('-400');
  });

  it('should complete when typing value below positive and greather than 9 interval', async () => {
    const user = userEvent.setup();
    render(<NumericTextfield label='example' min={100} />);

    const input = screen.getByRole<HTMLInputElement>('textbox');

    await act(async () => {
      await user.type(input, '4');
    });

		expect(input.value).toBe('400');
  });

  it('should complete when typing value above negative and lesser than -9 interval', async () => {
    const user = userEvent.setup();
    render(<NumericTextfield label='example' max={-100} />);

    const input = screen.getByRole<HTMLInputElement>('textbox');

    await act(async () => {
      await user.type(input, '-4');
    });

		expect(input.value).toBe('-400');
  });
});
