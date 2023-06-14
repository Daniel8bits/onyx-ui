/* eslint-disable react/prop-types */
import React, {useCallback, useEffect} from 'react';
import {DatePickerPanels} from '../DatePickerTemplate';
import {type DatePickerYearsProps} from './DatePickerYearsTemplate';
import type DatePickerYearsTemplate from './DatePickerYearsTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import behavior from '@internals/behavior';

const DatePickerYearsBehavior = behavior<DatePickerYearsProps, typeof DatePickerYearsTemplate>(props => {
  const {Template, innerRef, ...templateProps} = props;
  const {ref, events} = useCreateComponentRef<typeof DatePickerYearsBehavior>(innerRef);

  const updateDate = useCallback((year: number) => {
    props.core.setDateByYear(year);
    props.setPanel(DatePickerPanels.MONTHS);
  }, []);

  return <Template el={ref} events={events} updateDate={updateDate} {...templateProps} />;
});

export default DatePickerYearsBehavior;
