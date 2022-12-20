import React, { useEffect, useRef } from 'react';

import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md'

interface UICheckBoxProps {
  label: string
  value: boolean
  className?: string
  onClick?: (event: React.MouseEvent) => void
  onAction?: StateSetter<boolean>
}

const UICheckBox: React.FC<UICheckBoxProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(ref.current) {
      ref.current.checked = props.value
    }
  }, [props.value]);

  /**
   * UICheckBox default action
   * Occurs when the user checks the box
   * @param event 
   */
  function actionPerformed(event: React.MouseEvent): void {
    props.onClick?.(event)
    props.onAction?.(!props.value)
  }

  return (
    <div className={`ui-checkbox ${props.className ?? ''}`} onClick={actionPerformed}>
      <input 
        ref={ref}
        type="checkbox"  
        defaultChecked={props.value ?? false}
      />
      {props.value ? <MdCheckBox  /> : <MdCheckBoxOutlineBlank  />}
      <span>
        {props.label}
      </span>
    </div>
  );
};

export default UICheckBox;