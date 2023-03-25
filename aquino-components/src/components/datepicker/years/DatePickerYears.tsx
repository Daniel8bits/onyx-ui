import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import DatePickerYearsBehavior from './DatePickerYearsBehavior';
import DatePickerYearsTemplate, {type DatePickerYearsProps, type DatePickerYearsTemplateProps, type DatePickerYearsTemplateStyle} from './DatePickerYearsTemplate';

const DatePickerYears: AquinoComponent<DatePickerYearsProps, DatePickerYearsTemplateStyle, DatePickerYearsTemplateProps> = props => <DatePickerYearsBehavior Template={DatePickerYearsTemplate} {...props} />;

export default DatePickerYears;
