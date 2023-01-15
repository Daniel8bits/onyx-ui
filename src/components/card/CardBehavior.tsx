import React from 'react';
import {type CardProps} from './Card';

interface CardBehaviorProps extends CardProps {
	Template: React.FC<CardProps>;
}

const CardBehavior: React.FC<CardBehaviorProps> = props => {
	const {Template, className, ...templateProps} = props;
	const classes = `ui-card ${className ?? ''}`;
	return (
		<Template className={classes} {...templateProps} />
	);
};

export default CardBehavior;
