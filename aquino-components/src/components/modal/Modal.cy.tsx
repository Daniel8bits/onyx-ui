import React from 'react';
import {resetPopOverState} from '@test/configs/ZustandConfigs';
import Modal from './Modal';
import {getModal} from '@hooks/useModal';

function renderModal() {
  cy.mount(
    <>
      <div>click outside</div>
      <Modal id='test'> 
        something 
      </Modal>
    </>,
  );
  return getModal('test');
}

describe('Modal Component', () => {
  resetPopOverState();

	it('should render content', () => {
		const modalControls = renderModal();
    cy.wait(500);

    cy.wrap(modalControls).invoke('open');
    cy.contains('something').should('exist');
	});

  it('should close when clicking outside', () => {
    const modalControls = renderModal();
    cy.wait(500);
    
    cy.wrap(modalControls).as('modal');
    cy.get('@modal').invoke('open');
    cy.contains('something').should('exist');

    cy.get('r%backdrop').realClick({x: 10, y: 10});
    cy.wait(500);
    cy.contains('something').should('not.exist');
	});
});
