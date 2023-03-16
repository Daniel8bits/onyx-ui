import useComponentRef from '@hooks/useComponentRef';
import {OnyxEvents} from '@internals/EventManager';
import React, {useEffect} from 'react';
import {type CheckBoxProps} from './CheckBox';
import type CheckBoxTemplate from './CheckBoxTemplate';

interface CheckBoxBehaviorProps extends CheckBoxProps {
	Template: React.FC<Props<typeof CheckBoxTemplate>>;
}

const CheckBoxBehavior: React.FC<CheckBoxBehaviorProps> = props => {
	const {Template, className, onAction, innerRef: forwardedRef, ...templateProps} = props;
	const classes = `ui-checkbox ${className ?? ''}`;
	const {ref, events, eventManager} = useComponentRef<HTMLInputElement>(forwardedRef);

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

	return <Template el={ref} events={events} className={classes} {...templateProps} />;
};

export default CheckBoxBehavior;
