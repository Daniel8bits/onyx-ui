import React from 'react';
import {type CardProps} from './Card';

const CardTemplate: React.FC<CardProps> = props => (
	<button type='button' className={props.className} onClick={props.onClick}>
		{props.image && <img src={props.image} alt={props.title} />}
		<div className='card-content'>
			{props.title && <h3>{props.title}</h3>}
			{props.children}
		</div>
	</button>
);

export default CardTemplate;
