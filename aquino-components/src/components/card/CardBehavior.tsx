/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import {type AquinoBehavior} from '@internals/ThemeManager';
import {type CardProps, type CardTemplateStyle} from './CardTemplate';
import type CardTemplate from './CardTemplate';
import useComponentRef from '@hooks/useComponentRef';
import {OnyxEvents} from '@internals/EventManager';

const CardBehavior: AquinoBehavior<CardProps, typeof CardTemplate, CardTemplateStyle> = props => {
	const {Template, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useComponentRef<HTMLButtonElement>(innerRef);
	useEffect(() => {
		eventManager.add(OnyxEvents.CLICK, () => {
			props.onAction?.();
		});
	}, []);
	return <Template el={ref} events={events} {...templateProps} />;
};

export default CardBehavior;
