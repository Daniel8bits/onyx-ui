import React from 'react'
import { UIBoxProps } from "./UIBox"

const UIBoxTemplate: React.FC<UIBoxProps> = (props) => (
  <div 
    className={props.className} 
    onClick={props.onClick}
  >
    {props.children}
  </div>
)

export default UIBoxTemplate