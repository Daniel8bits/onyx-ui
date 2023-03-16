import React from 'react';
import CardBehavior from './CardBehavior';
import CardTemplate from './CardTemplate';

export interface CardProps {
	className?: string;
	image?: string;
	title?: string;
	onClick?: () => void;
	children: React.ReactNode;
}

const Card: React.FC<CardProps> = props => <CardBehavior Template={CardTemplate} {...props} />;

export default Card;
