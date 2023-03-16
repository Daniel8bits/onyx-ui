import React from 'react';
import ButtonBehavior from './ButtonBehavior';
import ButtonTemplate from './ButtonTemplate';

export interface ButtonProps {
	children: React.ReactNode;
	onAction?: () => void;
	className?: string;
	submit?: boolean;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = props => <ButtonBehavior Template={ButtonTemplate} {...props} />;

export default Button;
