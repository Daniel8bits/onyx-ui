import React from 'react';
import {type DatePickerWeeksProps} from './template';
import type DatePickerWeeksTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<DatePickerWeeksProps, typeof DatePickerWeeksTemplate>(props => {
  const {innerRef, ...templateProps} = props;
  const {ref, events} = useCreateComponentRef<B<DatePickerWeeksProps, typeof DatePickerWeeksTemplate>>(innerRef);

  return {
    el: ref,
    events,
    ...templateProps,
  };
});

export default Behavior;
