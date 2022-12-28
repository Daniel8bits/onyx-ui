import React from 'react';
import UIButtonBehavior from './UIButtonBehavior';
import UIButtonTemplate from './UIButtonTemplate';

export interface UIButtonProps {
  children: React.ReactNode
  onAction?: () => void
  className?: string
  submit?: boolean
  disabled?: boolean
}

const UIButton: React.FC<UIButtonProps> = (props) => {
  return <UIButtonBehavior Template={UIButtonTemplate} {...props}   />
}

export default UIButton;