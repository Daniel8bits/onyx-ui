/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import {type BoxTemplateStyle, type BoxProps} from './BoxTemplate';
import type BoxTemplate from './BoxTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {AquinoEvents} from '@internals/EventManager';
import {type AquinoBehavior} from '@internals/ThemeManager';

const BoxBehavior: AquinoBehavior<BoxProps, typeof BoxTemplate> = props => {
	const {Template, className, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useCreateComponentRef<typeof BoxBehavior>(innerRef);
	useEffect(() => {
		if (!props.onAction) return;
		eventManager.add(0, AquinoEvents.CLICK, props.onAction);
	}, []);
	return <Template el={ref} events={events} {...templateProps} />;
};

export default BoxBehavior;
