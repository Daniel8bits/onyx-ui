/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import useComponentRef from '@hooks/useComponentRef';
import {OnyxEvents} from '@internals/EventManager';
import {type AquinoBehavior} from '@internals/ThemeManager';
import type ButtonTemplate from './ButtonTemplate';
import {type ButtonProps, type ButtonTemplateStyle} from './ButtonTemplate';

const ButtonBehavior: AquinoBehavior<ButtonProps, typeof ButtonTemplate, ButtonTemplateStyle> = props => {
	const {Template, className, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useComponentRef<HTMLButtonElement>(innerRef);
	useEffect(() => {
		eventManager.add(OnyxEvents.CLICK, () => {
			props.onAction?.();
		});
	}, []);
	return <Template el={ref} events={events} {...templateProps} />;
};

export default ButtonBehavior;
