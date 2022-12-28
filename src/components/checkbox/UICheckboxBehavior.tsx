import React, { useEffect, useRef } from 'react'
import { UICheckBoxProps } from "./UICheckbox";


interface UICheckBoxBehaviorProps extends UICheckBoxProps {
  Template: React.FC<UICheckBoxProps>
}

const UICheckBoxBehavior: React.FC<UICheckBoxBehaviorProps> = (props) => {
  const {Template, className, ref: forwardRef, ...templateProps} = props
  const classes = `ui-checkbox ${className ?? ''}`
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(ref.current && forwardRef) {
      forwardRef.current = ref.current
    }
  }, [forwardRef]);

  useEffect(() => {
    if(ref.current) {
      ref.current.checked = props.value
    }
  }, [props.value]);

  return <Template ref={ref} className={classes} {...templateProps}  />
}

export default UICheckBoxBehavior