import {type AquinoComponentProps} from '@internals/ThemeManager';
import React from 'react';

import CheckBoxBehavior from './CheckBoxBehavior';
import CheckBoxTemplate, {type CheckBoxTemplateStyleType} from './CheckBoxTemplate';

export interface CheckBoxProps extends AquinoComponentProps<CheckBoxProps, CheckBoxTemplateStyleType> {
	label: string;
	value: boolean;
	className?: string;
	onClick?: (event: React.MouseEvent) => void;
	onAction?: StateSetter<boolean>;
}

const CheckBox: React.FC<CheckBoxProps> = props => <CheckBoxBehavior Template={CheckBoxTemplate} {...props} />;

export default CheckBox;
