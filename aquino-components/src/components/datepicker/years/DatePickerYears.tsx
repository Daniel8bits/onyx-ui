import React from 'react';
import {type DatePickerPanelProps} from '../DatePickerTemplate';
import DatePickerYearsBehavior from './DatePickerYearsBehavior';
import DatePickerYearsTemplate from './DatePickerYearsTemplate';

export interface DatePickerYearsProps extends DatePickerPanelProps {
  ratio: number;
}

const DatePickerYears: React.FC<DatePickerYearsProps> = props => <DatePickerYearsBehavior Template={DatePickerYearsTemplate} {...props} />;

export default DatePickerYears;
