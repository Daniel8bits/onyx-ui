/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import useComponentRef from '@hooks/useComponentRef';
import {OnyxEvents} from '@internals/EventManager';
import {type AquinoBehavior} from '@internals/ThemeManager';
import type CheckBoxTemplate from './CheckBoxTemplate';
import {type CheckBoxTemplateStyle, type CheckBoxProps} from './CheckBoxTemplate';

const CheckBoxBehavior: AquinoBehavior<CheckBoxProps, typeof CheckBoxTemplate, CheckBoxTemplateStyle> = props => {
	const {Template, onAction, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useComponentRef<HTMLInputElement>(innerRef);

	useEffect(() => {
		if (ref.current) {
			ref.current.checked = props.value;
		}
	}, [props.value]);

	useEffect(() => {
		eventManager.add(OnyxEvents.CLICK, () => {
			props.onAction?.(v => !v);
		});
	}, []);

	return <Template el={ref} events={events} {...templateProps} />;
};

export default CheckBoxBehavior;
