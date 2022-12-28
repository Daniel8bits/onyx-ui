import React from 'react'
import { UIButtonProps } from "./UIButton";

const UIButtonTemplate: React.FC<UIButtonProps> = (props) => (
  <button 
    className={props.className}
    type={props.submit ? "submit" : "button"}
    onClick={props.onAction}
    disabled={props.disabled}
  >
    {props.children}
  </button>
)

export default UIButtonTemplate