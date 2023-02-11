import React from 'react';
import {beforeEach, vi} from 'vitest';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PopOver from './PopOver';
import {getPopOver} from '@hooks/usePopOver';
import {resetPopOverState} from '@test/configs/ZustandConfigs';
import Root from '@internals/Root';

resetPopOverState();

function renderPopOver() {
  const anchor = React.createRef<HTMLDivElement>();
  render(
    <Root>
      <div ref={anchor}> click outside </div>
      <div>
        <PopOver 
          id='test' 
          anchor={anchor}
          position='bottom'
          width={100}
          height={100}
        > 
          something 
        </PopOver>
      </div>
    </Root>,
  );
  return getPopOver('test');
}

function getOutsideElement() {
  return screen.getByText('click outside');
}

describe('Popover Component', () => {
	it('should render content', () => {
		const {open} = renderPopOver();

    act(() => {
      open();
    });

		expect(screen.getByText('something')).toBeInTheDocument();
	});

  it('should close when clicking outside', () => {
		const {open} = renderPopOver();

    act(() => {
      open();
    });

    expect(screen.getByText('something')).toBeInTheDocument();

    act(() => {
      userEvent.click(getOutsideElement()); 
    });

		expect(screen.queryByText('something')).not.toBeInTheDocument();
	});
/*
.
	it('should run the callback on click', async () => {
		const clickHandler = vi.fn();
		render(<PopOver onAction={clickHandler}> something </PopOver>);

		const button = screen.getByText('something');
		userEvent.click(button);

		expect(clickHandler).toHaveBeenCalledTimes(1);
	});
*/
});
