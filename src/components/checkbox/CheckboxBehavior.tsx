import React, {useEffect, useRef} from 'react';
import {type CheckBoxProps} from './Checkbox';

interface CheckBoxBehaviorProps extends CheckBoxProps {
	Template: React.FC<CheckBoxProps>;
}

const CheckBoxBehavior: React.FC<CheckBoxBehaviorProps> = props => {
	const {Template, className, innerRef: forwardRef, ...templateProps} = props;
	const classes = `ui-checkbox ${className ?? ''}`;
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (ref.current && forwardRef) {
			forwardRef.current = ref.current;
		}
	}, [forwardRef]);

	useEffect(() => {
		if (ref.current) {
			ref.current.checked = props.value;
		}
	}, [props.value]);

	return <Template innerRef={ref} className={classes} {...templateProps} />;
};

export default CheckBoxBehavior;
