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

const CardTemplate = template<CardProps, HTMLButtonElement, CardTemplateStyle>((props, style) => (
	<button 
		type='button' 
		className={`${style?.button[0] ?? ''} ${props.className ?? ''}`} 
		{...props.events}
	>
		{props.image && <img className={style?.button[1].img} src={props.image} alt={props.title} />}
		<div className={style?.button[1].div[0]}>
			{props.title && <h3 className={style?.button[1].div[1].h3}>{props.title}</h3>}
			{props.children}
		</div>
	</button>
), initialStyleValue);

export default CardTemplate;
