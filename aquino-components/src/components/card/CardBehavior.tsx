/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import {type AquinoBehavior} from '@internals/ThemeManager';
import {type CardProps} from './CardTemplate';
import type CardTemplate from './CardTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {AquinoEvents} from '@internals/EventManager';

const CardBehavior: AquinoBehavior<CardProps, typeof CardTemplate> = props => {
	const {Template, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useCreateComponentRef<typeof CardBehavior>(innerRef);
	useEffect(() => {
		if (!props.onAction) return;
		eventManager.add(AquinoEvents.CLICK, props.onAction);
	}, []);
	return <Template el={ref} events={events} {...templateProps} />;
};

export default CardBehavior;
