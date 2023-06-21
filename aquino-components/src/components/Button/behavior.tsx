import React, {useEffect} from 'react';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {AquinoEvents} from '@internals/EventManager';
import type ButtonTemplate from './template';
import {type ButtonProps} from './template';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<ButtonProps, typeof ButtonTemplate>(props => {
	const {className, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useCreateComponentRef<B<ButtonProps, typeof ButtonTemplate>>(innerRef);
	useEffect(() => {
		if (!props.onAction) return;
		eventManager.add(0, AquinoEvents.CLICK, props.onAction);
	}, []);
	return {
		el: ref,
		events,
		...templateProps,
	};
});

export default Behavior;
