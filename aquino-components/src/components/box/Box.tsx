import React from 'react';
import BoxBehavior from './BoxBehavior';
import BoxTemplate from './BoxTemplate';

export interface BoxProps {
	className?: string;
	onClick?: () => void;
	children: React.ReactNode;
}

const Box: React.FC<BoxProps> = props => <BoxBehavior Template={BoxTemplate} {...props} />;

export default Box;
