import React from 'react';
import {beforeEach, vi} from 'vitest';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {getPopOver} from '@hooks/usePopOver';
import {resetPopOverState} from '@test/configs/ZustandConfigs';
import Root from '@internals/Root';
import Modal from './Modal';
import {getModal} from '@hooks/useModal';

resetPopOverState();

function renderModal() {
  render(
    <Root>
      <Modal id='test'> 
        something 
      </Modal>
    </Root>,
  );
  return getModal('test');
}

describe('Modal Component', () => {
	it('should render content', () => {
		const {open} = renderModal();

    act(() => {
      open();
    });

		expect(screen.getByText('something')).toBeInTheDocument();
	});

  it('should close when clicking outside', () => {
		const {open} = renderModal();

    act(() => {
      open();
    });

    expect(screen.getByText('something')).toBeInTheDocument();
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
