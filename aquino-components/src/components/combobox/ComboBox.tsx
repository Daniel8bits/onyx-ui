import React from 'react';

import {type ComboItemData, type ComboItemType} from './ComboBoxCore';
import ComboBoxBehavior from './ComboBoxBehavior';
import ComboBoxTemplate from './ComboBoxTemplate';

export interface ComboBoxProps {
  id: string;
  name?: string;
  template?: string;
  className?: string;
  items: ComboItemType;
  value: Nullable<ComboItemData>;
  onAction: StateSetter<Nullable<ComboItemData>>;
  label?: string;
  allowNull?: boolean;
  allowSearch?: boolean;
}

const ComboBox: React.FC<ComboBoxProps> = props => <ComboBoxBehavior Template={ComboBoxTemplate} {...props} />;

export default ComboBox;
