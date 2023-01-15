import React from 'react';

import CheckBoxBehavior from './CheckboxBehavior';
import CheckBoxTemplate from './CheckboxTemplate';

export interface CheckBoxProps {
	label: string;
	value: boolean;
	className?: string;
	innerRef?: ReactComponentRef<HTMLInputElement>;
	onClick?: (event: React.MouseEvent) => void;
	onAction?: StateSetter<boolean>;
}

const CheckBox: React.FC<CheckBoxProps> = props => <CheckBoxBehavior Template={CheckBoxTemplate} {...props} />;

export default CheckBox;
