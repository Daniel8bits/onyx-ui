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

export default template<
	BoxProps, 
	HTMLDivElement, 
	BoxTemplateStyle
>({
	name: 'box',
	jsx: (props, data) => (
		<div
			data-aquino={data.dataAquino}
			className={`${data.theme?.div[0] ?? ''} ${props.className ?? ''}`} 
			{...props.events}
		>
			{props.children}
		</div>
	), 
	theme: initialStyleValue,
});

