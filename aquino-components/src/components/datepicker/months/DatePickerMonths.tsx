import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import {type DatePickerPanelProps} from '../DatePickerTemplate';
import DatePickerMonthsBehavior from './DatePickerMonthsBehavior';
import DatePickerMonthsTemplate, {type DatePickerMonthsProps, type DatePickerMonthsTemplateProps, type DatePickerMonthsTemplateStyle} from './DatePickerMonthsTemplate';

const DatePickerMonths: AquinoComponent<DatePickerMonthsProps, DatePickerMonthsTemplateStyle, DatePickerMonthsTemplateProps> = props => <DatePickerMonthsBehavior Template={DatePickerMonthsTemplate} {...props} />;

export default DatePickerMonths;
