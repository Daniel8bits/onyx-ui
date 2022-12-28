import UIComponentCore from '@components/UIComponentCore';
import UIObservable from '@components/UIObservable';
import useNew from '@hooks/useNew';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { IconType } from 'react-icons';
import MaskedInput from 'react-text-mask';

type UIMask = (string|RegExp)[]

function decomposeMask(mask: (string|RegExp)[]) {
  
}

class UITextfieldCore extends UIComponentCore {

  private _mask: UIObservable<Nullable<UIMask>>
  private _decomposedMask: Nullable<UIMask>

  constructor(mask: Nullable<UIMask>) {
    super()
    this._mask = new UIObservable(this, 'mask', mask);
    this._decomposeMask()
  }

  private _decomposeMask() {
    const mask = this._mask.get()
    if(!mask) return
    let decomposedMask: (string|RegExp)[] = []
    mask.forEach(value => {
      if(value instanceof RegExp) {
        decomposedMask.push(value)
        return
      }
      decomposedMask = decomposedMask.concat(value.split(''))
    })
    this._decomposedMask = decomposedMask
  }

  public get decomposedMask() {
    return this._decomposedMask
  }

}

export interface UITextFieldProps {
  id: string;
  label?: string;
  mask?: UIMask
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  defaultValue?: string
  template?: string;
  password?: boolean;
  disabled?: boolean
  icon?: IconType
  iconPosition?: 'left' | 'right'
  onFocus?: (ev: React.FocusEvent) => void;
  onBlur?: (ev: React.FocusEvent) => void;
  onChange?: (ev: React.ChangeEvent) => void;
  onKeyUp?: (ev: React.KeyboardEvent) => void;
  onKeyDown?: (ev: React.KeyboardEvent) => void;
  onMouseUp?: (ev: React.MouseEvent) => void;
  onAction?: (value: string) => void
  onClickIcon?: () => void
  onLoad?: (ref: React.RefObject<HTMLInputElement>) => void
  iconContainerRef?: React.RefObject<HTMLDivElement>
}

const UITextField: React.ForwardRefRenderFunction<HTMLInputElement, UITextFieldProps> = (props, externRef) => {
  
  const inputTextRef = useRef<HTMLInputElement>(null)
  const maskedInputRef = useRef<MaskedInput>(null)

  const core = useNew(UITextfieldCore, [props.mask])

  useEffect(() => {

    if(props.mask && !inputTextRef.current && maskedInputRef.current) {
      const inputRef = inputTextRef as React.MutableRefObject<HTMLInputElement>
      inputRef.current = maskedInputRef.current.inputElement as HTMLInputElement
    }


    if (inputTextRef.current) {
      if (externRef) {
        (externRef as React.MutableRefObject<HTMLInputElement>).current = inputTextRef.current
      }
      props.onLoad?.(inputTextRef)
    }

  }, []);

  /**
   * UIInputText default action
   * Occurs when the user insert some text and the key is released
   * @param event 
   */
  const actionPerformed = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.disabled) return
    if (props.onKeyUp) {
      props.onKeyUp(event)
    }
    if (props.onAction && inputTextRef.current) {
      props.onAction(inputTextRef.current.value)
    }
  }, [props.disabled, props.onKeyUp, props.onAction])

  const inputProps = useMemo(() => ({
    id: props.id,
    name: props.id,
    type: props.password ? 'password' : 'text',
    placeholder: props.placeholder ?? '',
    disabled: props.disabled,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onKeyUp: actionPerformed,
    onKeyDown: props.onKeyDown,
    onChange: props.onChange,
    onMouseUp: props.onMouseUp,
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    'aria-label': props.ariaLabel ?? props.label ?? undefined,
  }), [
    props.id,
    props.password,
    props.placeholder,
    props.disabled,
    props.onFocus,
    props.onBlur,
    props.onKeyDown,
    props.onChange,
    props.onMouseUp,
    props.ariaLabel,
    props.label,
    actionPerformed
  ])

  const input = useMemo(() => {
    if(!core.decomposedMask) return
    return props.mask ?
      <MaskedInput ref={maskedInputRef} mask={core.decomposedMask} showMask {...inputProps}  /> :
      <input ref={inputTextRef} {...inputProps} />
  }, [props.mask])

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
        {input}
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
      {props.icon ? inputWithIcon() : input}
    </div>
  );
};

export default forwardRef(UITextField);