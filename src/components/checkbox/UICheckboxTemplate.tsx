import React, { useCallback } from 'react'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { UICheckBoxProps } from './UICheckbox';

const UICheckBoxTemplate: React.FC<UICheckBoxProps> = (props) => {

  const onClick = useCallback((event: React.MouseEvent) => {
    props.onClick?.(event)
    props.onAction?.(!props.value)
  },[]);

  return (
    <div className={props.className} onClick={onClick}>
      <input 
        ref={props.ref}
        type="checkbox"  
        defaultChecked={props.value ?? false}
      />
      {props.value ? <MdCheckBox  /> : <MdCheckBoxOutlineBlank  />}
      <span>
        {props.label}
      </span>
    </div>
  )
}

export default UICheckBoxTemplate