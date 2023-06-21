import React, {useEffect, useRef, useState} from 'react';
import useNew from '@hooks/useNew';
import DatePickerCore from './common/DatePickerCore';
import {type DatePickerProps} from './template';
import type DatePickerTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<DatePickerProps, typeof DatePickerTemplate>(props => {
  const {innerRef, ...templateProps} = props;

  const [input, setInput] = useState<{value: (v?: string) => string}>();

  const {ref, events} = useCreateComponentRef<B<DatePickerProps, typeof DatePickerTemplate>>(innerRef);
  const core = useNew(DatePickerCore, [props.value, props.onAction]);

  useEffect(() => {
    core.setInput(input?.value);
  }, [input]);

  useEffect(() => {
    if (props.value !== core.value) {
      core.setValue(props.value);
    }
  }, [props.value]);

  return {
    core,
    el: ref,
    updateValue: setInput,
    events,
    ...templateProps,
  };
});

export default Behavior;
