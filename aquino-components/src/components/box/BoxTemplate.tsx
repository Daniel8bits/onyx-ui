import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import React from 'react';

export interface BoxProps {
	className?: string;
	onAction?: () => void;
	children: React.ReactNode;
}

const initialStyleValue = {
	div: '',
} satisfies Theme;

export type BoxTemplateStyle = typeof initialStyleValue;

const BoxTemplate = template<BoxProps, HTMLDivElement, BoxTemplateStyle>((props, style) => (
	<div
		className={`${style?.div[0] ?? ''} ${props.className ?? ''}`} 
		{...props.events}
	>
		{props.children}
	</div>
), initialStyleValue);

export default BoxTemplate;
