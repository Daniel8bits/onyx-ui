import React from 'react';
import {vi} from 'vitest';
import {render, user, screen, act} from '@test/tools';
import ScrollContainer from './ScrollContainer';

describe('ScrollContainer Component', () => {
	it('should render content', () => {
		render(<ScrollContainer> something </ScrollContainer>);

		expect(screen.getByText('something')).toBeInTheDocument();
	});

	it('should not render scrolls when contents dimensions is lesser than containers', () => {
		render(<ScrollContainer> something </ScrollContainer>);

		const verticalScrollBar = screen.queryByRole('vertical scroll bar');
		const horizontalScrollBar = screen.queryByRole('horizontal scroll bar');

		expect(verticalScrollBar).not.toBeInTheDocument();
		expect(horizontalScrollBar).not.toBeInTheDocument();
	});

	it('should render vertical scroll when contents height is greater than containers', async () => {
		render(
			<div style={{width: `${global.innerWidth}px`, height: `${global.innerHeight}px`}}>
				<ScrollContainer>
					<div style={{height: `${global.innerHeight * 1.5}px`}}> 
						something 
					</div> 
				</ScrollContainer>
			</div>,
		);

		console.log('hmm');  

		const verticalScrollBar = screen.getByRole('vertical scroll bar');

		expect(verticalScrollBar).toBeInTheDocument();
	});
/* .
	it('should render horizontal scroll when contents width is greater than containers', () => {

	});

	it('should render both scrolls when contents dimensions is greater than containers', () => {

	});

	it('should move vertical scroll when using mouse wheel', () => {

	});

	it('should move vertical scroll when using mouse click', () => {

	});

	it('should move horizontal scroll when using mouse wheel with shift', () => {

	});

	it('should move horizontal scroll when using mouse click', () => {

	});
*/
});
