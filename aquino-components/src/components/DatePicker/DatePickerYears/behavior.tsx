import React, {useCallback, useEffect} from 'react';
import {DatePickerPanels} from '../template';
import {type DatePickerYearsProps} from './template';
import type DatePickerYearsTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<DatePickerYearsProps, typeof DatePickerYearsTemplate>(props => {
  const {innerRef, ...templateProps} = props;
  const {ref, events} = useCreateComponentRef<B<DatePickerYearsProps, typeof DatePickerYearsTemplate>>(innerRef);

  const updateDate = useCallback((year: number) => {
    props.core.setDateByYear(year);
    props.setPanel(DatePickerPanels.MONTHS);
  }, []);

  return {
    el: ref,
    events,
    updateDate,
    ...templateProps,
  };
});

export default Behavior;
