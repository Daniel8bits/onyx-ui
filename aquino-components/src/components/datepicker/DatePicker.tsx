import React from 'react';
import {type TextfieldProps} from '@components/textfield/Textfield';

import type ExtendedDate from './ExtendedDate';
import DatePickerTemplate from './DatePickerTemplate';
import DatePickerBehavior from './DatePickerBehavior';

export interface DatePickerProps extends Override<TextfieldProps, {
  value: Nullable<ExtendedDate>;
  onAction: StateSetter<Nullable<ExtendedDate>>;
}> {
}

const DatePicker: React.FC<DatePickerProps> = props => <DatePickerBehavior Template={DatePickerTemplate} {...props} />;

export default DatePicker;
