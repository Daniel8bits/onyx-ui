/* eslint-disable react/prop-types */
import useNew from '@hooks/useNew';
import useUpdater from '@hooks/useUpdater';
import {type AquinoBehavior} from '@internals/ThemeManager';
import React, {useEffect, useRef, useState} from 'react';
import DatePickerCore from './DatePickerCore';
import {type DatePickerProps} from './DatePickerTemplate';
import type DatePickerTemplate from './DatePickerTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {type ComponentRefObject} from '@internals/ComponentRef';

const DatePickerBehavior: AquinoBehavior<DatePickerProps, typeof DatePickerTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;

  const [input, setInput] = useState<{value: (v?: string) => string}>();

  const [, update] = useUpdater();
  const {ref, events} = useCreateComponentRef<typeof DatePickerBehavior>(innerRef);
  const core = useNew(DatePickerCore, [props.value, props.onAction]);

  useEffect(() => {
    core.subscribe(['value', 'yearsRange'], update);
    return () => {
      core.unsubscribe(['value', 'yearsRange'], update);
    };
  }, []);

  useEffect(() => {
    core.setInput(input?.value);
  }, [input]);

  useEffect(() => {
    if (props.value !== core.value.get()) {
      core.setValue(props.value);
    }
  }, [props.value]);

  return <Template core={core} el={ref} updateValue={setInput} events={events} {...templateProps} />;
};

export default DatePickerBehavior;
