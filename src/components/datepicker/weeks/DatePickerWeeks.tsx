import React from 'react';
import {type DatePickerPanelProps} from '../DatePickerTemplate';
import DatePickerWeeksBehavior from './DatePickerWeeksBehavior';
import DatePickerWeeksTemplate from './DatePickerWeeksTemplate';

export interface DatePickerWeeksProps extends DatePickerPanelProps {
  ratio: number;
}

const DatePickerWeeks: React.FC<DatePickerWeeksProps> = props => <DatePickerWeeksBehavior Template={DatePickerWeeksTemplate} {...props} />;

export default DatePickerWeeks;
