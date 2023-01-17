import React from 'react';
import {type IconType} from 'react-icons';
import {type Mask} from './TextfieldCore';
import TextfieldBehavior from './TextfieldBehavior';
import TextfieldTemplate from './TextfieldTemplate';

export interface TextfieldProps {
  id: string;
  label?: string;
  mask?: Mask;
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
  ref?: ReactComponentRef<HTMLInputElement>;
}

const Textfield: React.FC<TextfieldProps> = props => <TextfieldBehavior Template={TextfieldTemplate} {...props} />;

export default Textfield;
