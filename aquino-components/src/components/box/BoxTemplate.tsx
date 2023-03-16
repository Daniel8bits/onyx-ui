import React from 'react';
import {type BoxProps} from './Box';

const BoxTemplate: React.FC<BoxProps> = props => (
	<div
		className={props.className}
		onClick={props.onClick}
	>
		{props.children}
	</div>
);

export default BoxTemplate;
