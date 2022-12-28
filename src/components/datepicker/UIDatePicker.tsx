import React from 'react';
import { UITextFieldProps } from '@components/textfield/UITextfield'

import UIDate from './UIDate';
import UIDatePickerTemplate from './UIDatePickerTemplate';
import UIDatePickerBehavior from './UIDatePickerBehavior';

export interface UIDatePickerProps extends Override<UITextFieldProps, {
  value: UIDate
  onAction: StateSetter<Nullable<UIDate>>
}> {
}

const UIDatePicker: React.FC<UIDatePickerProps> = (props) => {
  return <UIDatePickerBehavior Template={UIDatePickerTemplate} {...props}  />
};
                                          
export default UIDatePicker;