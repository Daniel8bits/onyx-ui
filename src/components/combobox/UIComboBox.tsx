import React from 'react';

import { UIComboItemData, UIComboItemType } from './UIComboBoxCore';
import UIComboBoxBehavior from './UIComboBoxBehavior';
import UIComboBoxTemplate from './UIComboBoxTemplate';

export interface UIComboBoxProps {
  id: string
  name?: string
  template?: string
  className?: string
  items: UIComboItemType
  value: Nullable<UIComboItemData>
  onAction: StateSetter<Nullable<UIComboItemData>>
  label?: string
  allowNull?: boolean
  allowSearch?: boolean
}

const UIComboBox: React.FC<UIComboBoxProps> = (props) => {
  return <UIComboBoxBehavior Template={UIComboBoxTemplate} {...props}  />
}

export default UIComboBox;