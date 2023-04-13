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

const ButtonTemplate = template<ButtonProps, HTMLButtonElement, ButtonTemplateStyle>((props, style) => (
	<button
		className={`${style?.button[0] ?? ''} ${props.className ?? ''}`} 
		type={props.submit ? 'submit' : 'button'}
		onClick={props.onAction}
		disabled={props.disabled}
		{...props.events}
	>
		{props.children}
	</button>
), initialStyleValue);

export default ButtonTemplate;
