import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import DatePickerWeeksBehavior from './DatePickerWeeksBehavior';
import DatePickerWeeksTemplate, {type DatePickerWeeksProps, type DatePickerWeeksTemplateStyle} from './DatePickerWeeksTemplate';

const DatePickerWeeks: AquinoComponent<DatePickerWeeksProps, DatePickerWeeksTemplateStyle> = props => <DatePickerWeeksBehavior Template={DatePickerWeeksTemplate} {...props} />;

export default DatePickerWeeks;
