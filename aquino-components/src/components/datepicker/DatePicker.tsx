import React from 'react';
import DatePickerTemplate from './DatePickerTemplate';
import DatePickerBehavior from './DatePickerBehavior';
import {type AquinoComponent} from '@internals/ThemeManager';

const DatePicker: AquinoComponent<typeof DatePickerBehavior> = props => <DatePickerBehavior Template={DatePickerTemplate} {...props} />;

export default DatePicker;
