import React, {useCallback} from 'react';
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';
import {type CheckBoxProps} from './Checkbox';

const CheckBoxTemplate: React.FC<CheckBoxProps> = props => {
	const onClick = useCallback((event: React.MouseEvent) => {
		props.onClick?.(event);
		props.onAction?.(!props.value);
	}, [props.value]);

	return (
		<div className={props.className} onClick={onClick}>
			<input
				ref={props.innerRef}
				type='checkbox'
				defaultChecked={props.value ?? false}
			/>
			{props.value ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
			<span>
				{props.label}
			</span>
		</div>
	);
};

export default CheckBoxTemplate;
