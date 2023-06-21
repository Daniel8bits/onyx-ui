import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import React from 'react';

export interface CardProps {
	className?: string;
	image?: string;
	title?: string;
	onAction?: () => void;
	children: React.ReactNode;
}

const initialStyleValue = {
	button: ['', {
		img: '',
		div: ['', {
			h3: '',
		}],
	}],
} satisfies Theme;

export type CardTemplateStyle = typeof initialStyleValue;

export default template<
	CardProps, 
	HTMLButtonElement, 
	CardTemplateStyle
>({
	name: 'card',
	jsx: (props, data) => (
		<button 
			data-aquino={data.dataAquino}
			type='button' 
			className={`${data.theme?.button[0] ?? ''} ${props.className ?? ''}`} 
			{...props.events}
		>
			{props.image && <img className={data.theme?.button[1].img} src={props.image} alt={props.title} />}
			<div className={data.theme?.button[1].div[0]}>
				{props.title && <h3 className={data.theme?.button[1].div[1].h3}>{props.title}</h3>}
				{props.children}
			</div>
		</button>
	), 
	theme: initialStyleValue,
});
