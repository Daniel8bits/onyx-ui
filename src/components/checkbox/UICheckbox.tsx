import React from 'react';

import UICheckBoxBehavior from './UICheckboxBehavior';
import UICheckBoxTemplate from './UICheckboxTemplate';

export interface UICheckBoxProps {
  label: string
  value: boolean
  className?: string
  ref?: ReactComponentRef<HTMLInputElement>
  onClick?: (event: React.MouseEvent) => void
  onAction?: StateSetter<boolean>
}

const UICheckBox: React.FC<UICheckBoxProps> = (props) => {
  return <UICheckBoxBehavior Template={UICheckBoxTemplate} {...props}  />
}

export default UICheckBox;