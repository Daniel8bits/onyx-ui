import React from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComboBox from './ComboBox';

const items = [
  {value: '0', label: 'cachorro'},
  {value: '1', label: 'gato'},
  {value: '2', label: 'galinha'},
  {value: '3', label: 'pato'},
  {value: '4', label: 'lagarto'},
  {value: '5', label: 'jacaré'},
];

const categorizedItems = {
  mamiferos: [
    {value: '0', label: 'cachorro'},
    {value: '1', label: 'gato'},
  ],
  aves: [
    {value: '2', label: 'galinha'},
    {value: '3', label: 'pato'},
  ],
  repteis: [
    {value: '4', label: 'lagarto'},
    {value: '5', label: 'jacaré'},
  ],
};

describe('ComboBox Component', () => {
	it('should render content', () => {
    const clickHandler = vi.fn();
		render(<ComboBox id='test' items={items} value={items[0]} onAction={clickHandler} />);

    const input = screen.getByDisplayValue('cachorro');
    expect(input).toBeInTheDocument();
	});

  it('should render content when categorized', () => {
    const clickHandler = vi.fn();
		render(<ComboBox id='test' items={categorizedItems} value={categorizedItems.mamiferos[0]} onAction={clickHandler} />);

		const input = screen.getByDisplayValue('cachorro');
    expect(input).toBeInTheDocument();
	});

	it('should open the popover', async () => {
		const clickHandler = vi.fn();
		render(
      <>
        <ComboBox id='test' items={items} value={items[0]} onAction={clickHandler} />
        <div> click outside </div>
      </>,
    );

		const input = screen.getByDisplayValue('cachorro');
		userEvent.click(input);

    expect(screen.queryByText('cachorro')).toBeInTheDocument();
    expect(screen.queryByText('gato')).toBeInTheDocument();
    expect(screen.queryByText('galinha')).toBeInTheDocument();
    expect(screen.queryByText('pato')).toBeInTheDocument();
    expect(screen.queryByText('lagarto')).toBeInTheDocument();
    expect(screen.queryByText('jacaré')).toBeInTheDocument();

    const div = screen.getByText('click outside');
    userEvent.click(div);

    expect(screen.queryByText('cachorro')).not.toBeInTheDocument();
    expect(screen.queryByText('gato')).not.toBeInTheDocument();
    expect(screen.queryByText('galinha')).not.toBeInTheDocument();
    expect(screen.queryByText('pato')).not.toBeInTheDocument();
    expect(screen.queryByText('lagarto')).not.toBeInTheDocument();
    expect(screen.queryByText('jacaré')).not.toBeInTheDocument();
	});

  it('should open the popover when categorized', async () => {
		const clickHandler = vi.fn();
		render(
      <>
        <ComboBox id='test' items={categorizedItems} value={categorizedItems.mamiferos[0]} onAction={clickHandler} />
        <div> click outside </div>
      </>,
    );

		const input = screen.getByRole('textbox');
		userEvent.click(input);

    expect(screen.queryByText('mamiferos')).toBeInTheDocument();
		expect(screen.queryByText('gato')).toBeInTheDocument();

    expect(screen.queryByText('aves')).toBeInTheDocument();
    expect(screen.queryByText('galinha')).toBeInTheDocument();
    expect(screen.queryByText('pato')).toBeInTheDocument();

    expect(screen.queryByText('repteis')).toBeInTheDocument();
    expect(screen.queryByText('lagarto')).toBeInTheDocument();
    expect(screen.queryByText('jacaré')).toBeInTheDocument();

    const div = screen.getByText('click outside');
    userEvent.click(div);

    expect(screen.queryByText('mamiferos')).not.toBeInTheDocument();
		expect(screen.queryByText('gato')).not.toBeInTheDocument();

    expect(screen.queryByText('aves')).not.toBeInTheDocument();
    expect(screen.queryByText('galinha')).not.toBeInTheDocument();
    expect(screen.queryByText('pato')).not.toBeInTheDocument();

    expect(screen.queryByText('repteis')).not.toBeInTheDocument();
    expect(screen.queryByText('lagarto')).not.toBeInTheDocument();
    expect(screen.queryByText('jacaré')).not.toBeInTheDocument();
	});

  it('should search items', async () => {
		const clickHandler = vi.fn();
		render(<ComboBox id='test' items={items} value={items[0]} onAction={clickHandler} allowSearch />);

		const input = screen.getByRole('textbox');
		userEvent.click(input);
    userEvent.clear(input);
    userEvent.type(input, 'ga');

    expect(screen.queryByText('gato')).toBeInTheDocument();
    expect(screen.queryByText('galinha')).toBeInTheDocument();
    expect(screen.queryByText('pato')).not.toBeInTheDocument();
	});
});
