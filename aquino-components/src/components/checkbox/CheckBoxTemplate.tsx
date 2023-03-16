import React, {useCallback} from 'react';
import template from '@internals/template';
import type {AquinoTemplateProps, Theme} from '@internals/ThemeManager';
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';
import {type CheckBoxProps} from './CheckBox';

const CheckBoxTemplateStyle = {
	div: ['', {
		input: '',
		icon: '',
		span: '',
	}],
} satisfies Theme;

export type CheckBoxTemplateStyleType = typeof CheckBoxTemplateStyle;

const CheckBoxTemplate = template<CheckBoxProps, HTMLInputElement, CheckBoxTemplateStyleType>((props, style) => (
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
), CheckBoxTemplateStyle);

export default CheckBoxTemplate;
