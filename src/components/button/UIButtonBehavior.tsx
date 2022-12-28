import React from 'react'
import { UIButtonProps } from "./UIButton"

interface UIButtonBehaviorProps extends UIButtonProps {
  Template: React.FC<UIButtonProps>
}

const UIButtonBehavior: React.FC<UIButtonBehaviorProps> = (props) => {
  const {Template, className, ...templateProps} = props
  const classes = `ui-button ${className ?? ''}`
  return <Template className={classes} {...templateProps} />
}

export default UIButtonBehavior