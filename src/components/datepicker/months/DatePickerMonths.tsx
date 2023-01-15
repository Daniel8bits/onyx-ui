import React from 'react';
import {type DatePickerPanelProps} from '../DatePickerTemplate';
import DatePickerMonthsBehavior from './DatePickerMonthsBehavior';
import DatePickerMonthsTemplate from './DatePickerMonthsTemplate';

export interface DatePickerMonthsProps extends DatePickerPanelProps {
}

const DatePickerMonths: React.FC<DatePickerMonthsProps> = props => <DatePickerMonthsBehavior Template={DatePickerMonthsTemplate} {...props} />;

export default DatePickerMonths;
