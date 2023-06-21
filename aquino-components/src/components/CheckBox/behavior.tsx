import React, {useEffect} from 'react';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {AquinoEvents} from '@internals/EventManager';
import type CheckBoxTemplate from './template';
import {type CheckBoxProps} from './template';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<CheckBoxProps, typeof CheckBoxTemplate>(props => {
	const {onAction, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useCreateComponentRef<B<CheckBoxProps, typeof CheckBoxTemplate>>(innerRef);

	useEffect(() => {
		if (ref.current) {
			ref.current.checked = props.value;
		}
	}, [props.value]);

	useEffect(() => {
		if (!props.onAction) return;
		eventManager.add(0, AquinoEvents.CLICK, () => {
			props.onAction?.(v => !v);
		});
	}, []);

	return {el: ref, events, ...templateProps};
});

export default Behavior;
