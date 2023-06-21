import React, {useCallback, useEffect} from 'react';
import {DatePickerPanels} from '../template';
import {type DatePickerMonthsProps} from './template';
import type DatePickerMonthsTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<DatePickerMonthsProps, typeof DatePickerMonthsTemplate>(props => {
  const {innerRef, ...templateProps} = props;
  const activeMonth = props.core.getCurrentDate();

  const {ref, events} = useCreateComponentRef<B<DatePickerMonthsProps, typeof DatePickerMonthsTemplate>>(innerRef);

  const updateDate = useCallback((month: number) => {
    props.core.setDateByMonth(month);
    props.setPanel(DatePickerPanels.WEEKS);
  }, []);

  return {
    el: ref,
    events,
    activeMonth,
    updateDate,
    ...templateProps,
  };
});

export default Behavior;
