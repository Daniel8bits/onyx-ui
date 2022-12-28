import React from 'react';
import UIBoxBehavior from './UIBoxBehavior';
import UIBoxTemplate from './UIBoxTemplate';

export interface UIBoxProps {
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

const UIBox: React.FC<UIBoxProps> = (props) => {
  return <UIBoxBehavior Template={UIBoxTemplate} {...props}   />
}

export default UIBox;