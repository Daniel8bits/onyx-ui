/* eslint-disable react/prop-types */
import React, {useCallback, useEffect} from 'react';
import {DatePickerPanels} from '../DatePickerTemplate';
import {type DatePickerMonthsProps} from './DatePickerMonthsTemplate';
import type DatePickerMonthsTemplate from './DatePickerMonthsTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import behavior from '@internals/behavior';

const DatePickerMonthsBehavior = behavior<DatePickerMonthsProps, typeof DatePickerMonthsTemplate>(props => {
  const {Template, innerRef, ...templateProps} = props;
  const activeMonth = props.core.getCurrentDate();

  const {ref, events} = useCreateComponentRef<typeof DatePickerMonthsBehavior>(innerRef);

  const updateDate = useCallback((month: number) => {
    props.core.setDateByMonth(month);
    props.setPanel(DatePickerPanels.WEEKS);
  }, []);

  return <Template el={ref} events={events} activeMonth={activeMonth} updateDate={updateDate} {...templateProps} />;
});

export default DatePickerMonthsBehavior;
