import React from 'react';
import ScrollContainer from './ScrollContainer';

describe('ScrollContainer Component', () => {
	it('should render content', () => {
		cy.mount(<ScrollContainer> something </ScrollContainer>);

		cy.contains('something').should('exist');
	});

	it('should not render scrolls when contents dimensions is lesser than containers', () => {
		cy.mount(<ScrollContainer> something </ScrollContainer>);

		cy.get('r%vertical scroll bar').should('not.exist');
		cy.get('r%horizontal scroll bar').should('not.exist');
	});

	it('should render vertical scroll when contents height is greater than containers', async () => {
		cy.mount(
			<ScrollContainer>
				<div style={{height: `${global.innerHeight * 1.5}px`}}> 
					something 
				</div> 
			</ScrollContainer>,
		);

		cy.get('r%vertical scroll bar').should('exist');
	});

	it('should render horizontal scroll when contents width is greater than containers', () => {
		cy.mount(
			<ScrollContainer>
				<div style={{width: `${global.innerWidth * 1.5}px`}}> 
					something 
				</div> 
			</ScrollContainer>,
		);

		cy.get('r%horizontal scroll bar').should('exist');
	});

	it('should render both scrolls when contents dimensions is greater than containers', () => {
		cy.mount(
			<ScrollContainer>
				<div style={{
					width: `${global.innerWidth * 1.5}px`, 
					height: `${global.innerHeight * 1.5}px`}
				}> 
					something 
				</div> 
			</ScrollContainer>,
		);

		cy.get('r%vertical scroll bar').should('exist');
		cy.get('r%horizontal scroll bar').should('exist');
	});
	
	it('should move vertical scroll when using mouse wheel', () => {
		cy.viewport(500, 500);
		cy.mount(
			<ScrollContainer>
				<div style={{height: '750px'}}> 
					something 
				</div> 
			</ScrollContainer>,
		);

		cy.contains('something').last().invoke('offset').its('top').as('content-top');

		const deltaY = 120;

		// Scrolling down
		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY});
		cy.get('@content-top').should('be.lt', 0);

		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY});
		cy.get('@content-top').should('be.lt', -270);

		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY});
		cy.get('@content-top').should('be.lt', -540);
		
		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY});
		cy.get('@content-top').should('be.lte', -751.5);

		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY});
		cy.get('@content-top').should('eq', -751.5);

		// Scrolling up
		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY: -deltaY});
		cy.get('@content-top').should('be.gt', -751.5);
		
		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY: -deltaY});
		cy.get('@content-top').should('be.gt', -540);
		
		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY: -deltaY});
		cy.get('@content-top').should('be.gt', -270);
		
		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY: -deltaY});
		cy.get('@content-top').should('be.gte', 0);
		
		cy.get('body').realMouseWheel({scrollBehavior: false, deltaY: -deltaY});
		cy.get('@content-top').should('eq', 0);
	});

	it('should move vertical scroll when using mouse click', () => {
		cy.viewport(500, 500);
		cy.mount(
			<ScrollContainer>
				<div style={{height: '750px'}}> 
					something 
				</div> 
			</ScrollContainer>,
		);

		cy.get('r%vertical scroll button').as('vertical-scroll');
		cy.contains('something').last().invoke('offset').its('top').as('content-top');

		const clickAndMoveScroll = (v: number) => {
			cy.get('@vertical-scroll')
				.trigger('mousedown')
				.trigger('mousemove', {movementY: v})
				.trigger('mousemove', {movementY: v})
				.trigger('mousemove', {movementY: v})
				.trigger('mouseup');
		};

		clickAndMoveScroll(10);
		cy.get('@content-top').should('be.lt', 0);

		clickAndMoveScroll(20);
		cy.get('@content-top').should('be.lt', -45);

		clickAndMoveScroll(30);
		cy.get('@content-top').should('be.lt', -135);
		cy.get('@content-top').should('eq', -250.5);

		clickAndMoveScroll(-30);
		cy.get('@content-top').should('be.gt', -250.5);

		clickAndMoveScroll(-20);
		cy.get('@content-top').should('be.gt', -135);
		
		clickAndMoveScroll(-10);
		cy.get('@content-top').should('be.gt', -45);
		cy.get('@content-top').should('eq', 0);
	});
	
	it('should move horizontal scroll when using mouse wheel with shift', () => {
		cy.viewport(500, 500);
		cy.mount(
			<ScrollContainer>
				<div style={{width: '750px'}}> 
					something 
				</div> 
			</ScrollContainer>,
		);

		cy.contains('something').last().invoke('offset').its('left').as('content-left');

		const deltaY = 120;

		// Scrolling down
		cy.get('body').trigger('wheel', {deltaY, shiftKey: true});
		cy.get('@content-left').should('be.lt', 0);
		
		cy.get('body').trigger('wheel', {deltaY, shiftKey: true});
		cy.get('@content-left').should('be.lt', -270);

		cy.get('body').trigger('wheel', {deltaY, shiftKey: true});
		cy.get('@content-left').should('be.lt', -540);
		
		cy.get('body').trigger('wheel', {deltaY, shiftKey: true});
		cy.get('@content-left').should('be.lte', -751.5);

		cy.get('body').trigger('wheel', {deltaY, shiftKey: true});
		cy.get('@content-left').should('eq', -751.5);

		// Scrolling up
		cy.get('body').trigger('wheel', {deltaY: -deltaY, shiftKey: true});
		cy.get('@content-left').should('be.gt', -751.5);
		
		cy.get('body').trigger('wheel', {deltaY: -deltaY, shiftKey: true});
		cy.get('@content-left').should('be.gt', -540);
		
		cy.get('body').trigger('wheel', {deltaY: -deltaY, shiftKey: true});
		cy.get('@content-left').should('be.gt', -270);
		
		cy.get('body').trigger('wheel', {deltaY: -deltaY, shiftKey: true});
		cy.get('@content-left').should('be.gte', 0);
		
		cy.get('body').trigger('wheel', {deltaY: -deltaY, shiftKey: true});
		cy.get('@content-left').should('eq', 0);
	});

	it('should move horizontal scroll when using mouse click', () => {
		cy.viewport(500, 500);
		cy.mount(
			<ScrollContainer>
				<div style={{width: '750px'}}> 
					something 
				</div> 
			</ScrollContainer>,
		);

		cy.get('r%horizontal scroll button').as('horizontal-scroll');
		cy.contains('something').last().invoke('offset').its('left').as('content-left');

		const clickAndMoveScroll = (v: number) => {
			cy.get('@horizontal-scroll')
				.trigger('mousedown')
				.trigger('mousemove', {movementX: v})
				.trigger('mousemove', {movementX: v})
				.trigger('mousemove', {movementX: v})
				.trigger('mouseup');
		};

		clickAndMoveScroll(10);
		cy.get('@content-left').should('be.lt', 0);

		clickAndMoveScroll(20);
		cy.get('@content-left').should('be.lt', -45);

		clickAndMoveScroll(30);
		cy.get('@content-left').should('be.lt', -135);
		cy.get('@content-left').should('eq', -250.5);

		clickAndMoveScroll(-30);
		cy.get('@content-left').should('be.gt', -250.5);

		clickAndMoveScroll(-20);
		cy.get('@content-left').should('be.gt', -135);
		
		clickAndMoveScroll(-10);
		cy.get('@content-left').should('be.gt', -45);
		cy.get('@content-left').should('eq', 0);
	});
});
