import React, {useEffect} from 'react';
import {type BoxProps} from './template';
import type BoxTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {AquinoEvents} from '@internals/EventManager';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<BoxProps, typeof BoxTemplate>(props => {
	const {className, innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useCreateComponentRef<B<BoxProps, typeof BoxTemplate>>(innerRef);
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
