import React from 'react';
import {type ButtonProps} from './Button';

interface ButtonBehaviorProps extends ButtonProps {
	Template: React.FC<ButtonProps>;
}

const ButtonBehavior: React.FC<ButtonBehaviorProps> = props => {
	const {Template, className, ...templateProps} = props;
	const classes = `ui-button ${className ?? ''}`;
	return <Template className={classes} {...templateProps} />;
};

export default ButtonBehavior;
