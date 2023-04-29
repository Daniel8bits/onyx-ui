/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {AquinoEvents} from '@internals/EventManager';
import {type AquinoBehavior} from '@internals/ThemeManager';
import type ButtonTemplate from './ButtonTemplate';
import {type ButtonProps} from './ButtonTemplate';

const ButtonBehavior: AquinoBehavior<ButtonProps, typeof ButtonTemplate> = props => {
	const {Template, className, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useCreateComponentRef<typeof ButtonBehavior>(innerRef);
	useEffect(() => {
		if (!props.onAction) return;
		eventManager.add(0, AquinoEvents.CLICK, props.onAction);
	}, []);
	return <Template el={ref} events={events} {...templateProps} />;
};

export default ButtonBehavior;
