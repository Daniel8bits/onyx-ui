import React from 'react'
import { UIBoxProps } from "./UIBox"

interface UIBoxBehaviorProps extends UIBoxProps {
  Template: React.FC<UIBoxProps>
}

const UIBoxBehavior: React.FC<UIBoxBehaviorProps> = (props) => {
  const {Template, className, ...templateProps} = props
  const classes = `ui-box ${className ?? ""} ${props.onClick ? 'clickable' : ''}`
  return <Template className={classes} {...templateProps}  />
}

export default UIBoxBehavior