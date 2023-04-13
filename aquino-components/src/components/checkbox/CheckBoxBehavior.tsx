/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {AquinoEvents} from '@internals/EventManager';
import {type AquinoBehavior} from '@internals/ThemeManager';
import type CheckBoxTemplate from './CheckBoxTemplate';
import {type CheckBoxProps} from './CheckBoxTemplate';

const CheckBoxBehavior: AquinoBehavior<CheckBoxProps, typeof CheckBoxTemplate> = props => {
	const {Template, onAction, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useCreateComponentRef<typeof CheckBoxBehavior>(innerRef);

	useEffect(() => {
		if (ref.current) {
			ref.current.checked = props.value;
		}
	}, [props.value]);

	useEffect(() => {
		if (!props.onAction) return;
		eventManager.add(AquinoEvents.CLICK, () => {
			props.onAction?.(v => !v);
		});
	}, []);

	return <Template el={ref} events={events} {...templateProps} />;
};

export default CheckBoxBehavior;
