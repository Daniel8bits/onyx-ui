import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import React from 'react';

export interface ButtonProps {
	children: React.ReactNode;
	onAction?: () => void;
	className?: string;
	submit?: boolean;
	disabled?: boolean;
}

const initialStyleValue = {
	button: '',
} satisfies Theme;

export type ButtonTemplateStyle = typeof initialStyleValue;

export default template<
	ButtonProps, 
	HTMLButtonElement, 
	ButtonTemplateStyle
>({
	name: 'button',
	jsx: (props, data) => (
		<button
			data-aquino={data.dataAquino}
			className={`${data.theme?.button[0] ?? ''} ${props.className ?? ''}`} 
			type={props.submit ? 'submit' : 'button'}
			onClick={props.onAction}
			disabled={props.disabled}
			{...props.events}
		>
			{props.children}
		</button>
	), 
	theme: initialStyleValue,
});
