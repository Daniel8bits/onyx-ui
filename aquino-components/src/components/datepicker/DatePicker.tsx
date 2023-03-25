import React from 'react';
import DatePickerTemplate, {type DatePickerProps, type DatePickerTemplateProps, type DatePickerTemplateStyle} from './DatePickerTemplate';
import DatePickerBehavior from './DatePickerBehavior';
import {type AquinoComponent} from '@internals/ThemeManager';

const DatePicker: AquinoComponent<DatePickerProps, DatePickerTemplateStyle, DatePickerTemplateProps> = props => <DatePickerBehavior Template={DatePickerTemplate} {...props} />;

export default DatePicker;
