import React from 'react';
import { IconType } from 'react-icons';
import { UIMask } from './UITextfieldCore';
import UITextfieldBehavior from './UITextfieldBehavior';
import UITextfieldTemplate from './UITextfieldTemplate';

export interface UITextfieldProps {
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
  ref?: ReactComponentRef<HTMLInputElement>
}

const UITextfield: React.FC<UITextfieldProps> = (props) => {
  return <UITextfieldBehavior Template={UITextfieldTemplate} {...props}  />
}

export default UITextfield;