import React from 'react';
import PopOverTemplate from './PopOverTemplate';
import PopOverBehavior from './PopOverBehavior';

export interface PopOverProps {
  readonly id?: string;
  width: number | 'inherit' | 'anchor';
  height: number | 'auto';
  anchor: ReactElementRef;
  open?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  scroll?: boolean;
  template?: string;
  className?: string;
  children?: any;
}

const PopOver: React.FC<PopOverProps> = props => <PopOverBehavior Template={PopOverTemplate} {...props} />;

export default PopOver;
