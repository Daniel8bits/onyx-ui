import React from 'react';
import {type BoxProps} from './Box';

interface BoxBehaviorProps extends BoxProps {
	Template: React.FC<BoxProps>;
}

const BoxBehavior: React.FC<BoxBehaviorProps> = props => {
	const {Template, className, ...templateProps} = props;
	const classes = `ui-box ${className ?? ''} ${props.onClick ? 'clickable' : ''}`;
	return <Template className={classes} {...templateProps} />;
};

export default BoxBehavior;
