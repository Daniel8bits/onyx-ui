import React from 'react';
import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import {type IconType} from 'react-icons';

export interface TextfieldProps {
  id?: string;
  label?: string;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  defaultValue?: string;
  template?: string;
  password?: boolean;
  disabled?: boolean;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  onFocus?: (ev: React.FocusEvent) => void;
  onBlur?: (ev: React.FocusEvent) => void;
  onChange?: (ev: React.ChangeEvent) => void;
  onKeyUp?: (ev: React.KeyboardEvent) => void;
  onKeyDown?: (ev: React.KeyboardEvent) => void;
  onMouseUp?: (ev: React.MouseEvent) => void;
  onAction?: (value: string) => void;
  onClickIcon?: () => void;
  onLoad?: (ref: React.RefObject<HTMLInputElement>) => void;
  iconContainerRef?: React.RefObject<HTMLDivElement>;
}

export interface TextfieldTemplateProps extends TextfieldProps {
  inputProps: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
}

const initialStyleValue = {
	div: ['', {
    label: '',
    div: ['', {
      input: '',
      button: ['', {
        icon: '',
      }],
    }],
  }],
} satisfies Theme;

export type TextfieldTemplateStyle = typeof initialStyleValue;

const TextfieldTemplate = template<TextfieldTemplateProps, HTMLInputElement, TextfieldTemplateStyle>((props, style) => (
  <div className={`${style?.div[0] ?? ''} ${props.className ?? ''}`} {...props.events}>
    {props.label
      && <label htmlFor={props.inputProps.id} className={style?.div[1].label}>
        {props.label}
      </label>}
    <div ref={props.iconContainerRef} className={style?.div[1].div[0]}>
      {props.icon && (!props.iconPosition || props.iconPosition === 'left')
        && <button 
          type='button' 
          onClick={props.disabled ? undefined : props.onClickIcon} 
          aria-label='button'
          className={style?.div[1].div[1].button[0]}
        >
          <props.icon className={style?.div[1].div[1].button[1].icon} />
        </button>}

      <input ref={props.el} className={style?.div[1].div[1].input} {...props.inputProps} />

      {props.icon && props.iconPosition === 'right'
        && <button 
          type='button' 
          onClick={props.disabled ? undefined : props.onClickIcon} 
          aria-label='button'
          className={style?.div[1].div[1].button[0]}
        >
          <props.icon className={style?.div[1].div[1].button[1].icon} />
        </button>}
    </div>
  </div>
), initialStyleValue);

export default TextfieldTemplate;
