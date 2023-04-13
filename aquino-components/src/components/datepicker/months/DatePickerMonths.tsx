import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import DatePickerMonthsBehavior from './DatePickerMonthsBehavior';
import DatePickerMonthsTemplate from './DatePickerMonthsTemplate';

const DatePickerMonths: AquinoComponent<typeof DatePickerMonthsBehavior> = props => <DatePickerMonthsBehavior Template={DatePickerMonthsTemplate} {...props} />;

export default DatePickerMonths;
