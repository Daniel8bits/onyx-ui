import React, {useEffect} from 'react';
import {type CardProps} from './template';
import type CardTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {AquinoEvents} from '@internals/EventManager';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<CardProps, typeof CardTemplate>(props => {
	const {innerRef, ...templateProps} = props;
	const {ref, events, eventManager} = useCreateComponentRef<B<CardProps, typeof CardTemplate>>(innerRef);
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
