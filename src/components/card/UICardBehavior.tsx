import React from 'react'
import { UICardProps } from "./UICard"

interface UICardBehaviorProps extends UICardProps {
  Template: React.FC<UICardProps>
}

const UICardBehavior: React.FC<UICardBehaviorProps> = (props) => {
  const {Template, className, ...templateProps} = props
  const classes = `ui-card ${className ?? ""}`
  return (
    <Template className={classes} {...templateProps}  />
  )
}

export default UICardBehavior