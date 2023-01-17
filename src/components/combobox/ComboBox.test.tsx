import React from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComboBox from './ComboBox';
import {type ComboItemData} from './ComboBoxCore';

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

		expect(screen.getByText('cachorro')).toBeInTheDocument();
	});

  it('should render content when categorized', () => {
    const clickHandler = vi.fn();
		render(<ComboBox id='test' items={categorizedItems} value={categorizedItems.mamiferos[0]} onAction={clickHandler} />);

		expect(screen.getByText('cachorro')).toBeInTheDocument();
	});

	it('should open the popover', async () => {
		const clickHandler = vi.fn();
		render(<ComboBox id='test' items={items} value={items[0]} onAction={clickHandler} />);

		const button = screen.getByText('cachorro');
		userEvent.click(button);

    const popover = screen.getByText('gato');

		expect(clickHandler).toHaveBeenCalledTimes(1);
	});
});
