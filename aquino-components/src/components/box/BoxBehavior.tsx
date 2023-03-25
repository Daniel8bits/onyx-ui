/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import {type BoxTemplateStyle, type BoxProps} from './BoxTemplate';
import type BoxTemplate from './BoxTemplate';
import useComponentRef from '@hooks/useComponentRef';
import {OnyxEvents} from '@internals/EventManager';
import {type AquinoBehavior} from '@internals/ThemeManager';

const BoxBehavior: AquinoBehavior<BoxProps, typeof BoxTemplate, BoxTemplateStyle> = props => {
	const {Template, className, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useComponentRef<HTMLDivElement>(innerRef);
	useEffect(() => {
		eventManager.add(OnyxEvents.CLICK, () => {
			props.onAction?.();
		});
	}, []);
	return <Template el={ref} events={events} {...templateProps} />;
};

export default BoxBehavior;
