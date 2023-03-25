import React, {useCallback} from 'react';
import template from '@internals/template';
import type {Theme} from '@internals/ThemeManager';
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';

export interface CheckBoxProps {
	label: string;
	value: boolean;
	className?: string;
	onClick?: (event: React.MouseEvent) => void;
	onAction?: StateSetter<boolean>;
}

const initialThemeValue = {
	div: ['', {
		input: '',
		icon: '',
		span: '',
	}],
} satisfies Theme;

export type CheckBoxTemplateStyle = typeof initialThemeValue;

const CheckBoxTemplate = template<CheckBoxProps, HTMLInputElement, CheckBoxTemplateStyle>((props, style) => (
	<div className={`${style?.div[0] ?? ''} ${props.className ?? ''}`} {...props.events}>
		<input
			ref={props.el}
			type='checkbox'
			defaultChecked={props.value ?? false}
			className={style?.div[1].input}
		/>
		{props.value 
			? <MdCheckBox className={style?.div[1].icon} /> 
			: <MdCheckBoxOutlineBlank className={style?.div[1].icon} />}
		<span className={style?.div[1].span}>
			{props.label}
		</span>
	</div>
), initialThemeValue);

export default CheckBoxTemplate;
