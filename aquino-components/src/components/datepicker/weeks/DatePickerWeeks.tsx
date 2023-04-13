import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import DatePickerWeeksBehavior from './DatePickerWeeksBehavior';
import DatePickerWeeksTemplate from './DatePickerWeeksTemplate';

const DatePickerWeeks: AquinoComponent<typeof DatePickerWeeksBehavior> = props => <DatePickerWeeksBehavior Template={DatePickerWeeksTemplate} {...props} />;

export default DatePickerWeeks;
