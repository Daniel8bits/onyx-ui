/* eslint-disable react/prop-types */
import React from 'react';
import {type DatePickerWeeksProps} from './DatePickerWeeksTemplate';
import type DatePickerWeeksTemplate from './DatePickerWeeksTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import behavior from '@internals/behavior';

const DatePickerWeeksBehavior = behavior<DatePickerWeeksProps, typeof DatePickerWeeksTemplate>(props => {
  const {Template, innerRef, ...templateProps} = props;
  const {ref, events} = useCreateComponentRef<typeof DatePickerWeeksBehavior>(innerRef);

  return <Template el={ref} events={events} {...templateProps} />;
});

export default DatePickerWeeksBehavior;
