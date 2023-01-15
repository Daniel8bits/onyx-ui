import React from 'react';
import {type ButtonProps} from './Button';

const ButtonTemplate: React.FC<ButtonProps> = props => (
	<button
		className={props.className}
		type={props.submit ? 'submit' : 'button'}
		onClick={props.onAction}
		disabled={props.disabled}
	>
		{props.children}
	</button>
);

export default ButtonTemplate;
