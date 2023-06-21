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

export default template<
	CheckBoxProps, 
	HTMLInputElement, 
	CheckBoxTemplateStyle
>({
	name: 'check-box',
	jsx: (props, data) => (
		<div 
			data-aquino={data.dataAquino}
			className={`${data.theme?.div[0] ?? ''} ${props.className ?? ''}`} 
			{...props.events}
		>
			<input
				ref={props.el}
				type='checkbox'
				defaultChecked={props.value ?? false}
				className={data.theme?.div[1].input}
			/>
			{props.value 
				? <MdCheckBox className={data.theme?.div[1].icon} /> 
				: <MdCheckBoxOutlineBlank className={data.theme?.div[1].icon} />}
			<span className={data.theme?.div[1].span}>
				{props.label}
			</span>
		</div>
	), 
	theme: initialThemeValue,
});
