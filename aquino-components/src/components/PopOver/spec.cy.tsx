import React from 'react';
import PopOver from '.';
import {getPopOver} from '@hooks/usePopOver';
import {resetPopOverState} from '@test/configs/ZustandConfigs';

function renderPopOver() {
  const anchor = React.createRef<HTMLDivElement>();
  cy.mount(
    <>
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
    </>,
  );
  return getPopOver('test');
}

describe('Popover Component', () => {
  resetPopOverState();

	it('should render content', () => {
		const popOverControls = renderPopOver();
    cy.wait(500);

    cy.wrap(popOverControls).invoke('open');
    cy.contains('something').should('exist');
	});

  it('should close when clicking outside', () => {
		const popOverControls = renderPopOver();
    cy.wait(500);

    cy.wrap(popOverControls).invoke('open');
    cy.contains('something').should('exist');

    cy.contains('click outside').realClick();
    cy.contains('something').should('not.exist');
	});
});
