import React, { useCallback } from "react"
import { UITextfieldProps } from "./UITextfield"
import UITextfieldCore from "./UITextfieldCore"

export interface UITextfieldTemplateProps extends UITextfieldProps {
  core: UITextfieldCore
  input: JSX.Element
}

const UITextfieldTemplate: React.FC<UITextfieldTemplateProps> = (props) => {

  const inputWithIcon = useCallback(() => {

    const onClickIcon = props.disabled ? undefined : props.onClickIcon

    if(!props.icon) return

    return (
      <div
        ref={props.iconContainerRef}
        className={`${props.onClickIcon ? 'icon-as-button' : ''}`}
      >
        {(!props.iconPosition || props.iconPosition === 'left') &&
          <button type='button' onClick={onClickIcon} aria-label='button'><props.icon /></button>}
        {props.input}
        {props.iconPosition === 'right' &&
          <button type='button' onClick={onClickIcon} aria-label='button'><props.icon /></button>}
      </div>
    )

  }, [
    props.icon, 
    props.onClickIcon, 
    props.iconContainerRef,
    props.iconPosition,
    props.disabled,
  ])

  return (
    <div className={`ui-textfield ${props.className ?? ''} ${props.template ?? 'default'} ${props.disabled ? 'disabled' : ''} ${props.icon && props.iconPosition ? 'hasIcon' : ''}`}>
      {props.label &&
        <label htmlFor={props.id}>
          {props.label}
        </label>}
      {props.icon ? inputWithIcon() : props.input}
    </div>
  );

}

export default UITextfieldTemplate