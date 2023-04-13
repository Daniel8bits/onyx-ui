import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import DatePickerYearsBehavior from './DatePickerYearsBehavior';
import DatePickerYearsTemplate from './DatePickerYearsTemplate';

const DatePickerYears: AquinoComponent<typeof DatePickerYearsBehavior> = props => <DatePickerYearsBehavior Template={DatePickerYearsTemplate} {...props} />;

export default DatePickerYears;
