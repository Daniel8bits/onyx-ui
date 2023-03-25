/* eslint-disable react/prop-types */
import useNew from '@hooks/useNew';
import useUpdater from '@hooks/useUpdater';
import {type AquinoBehavior} from '@internals/ThemeManager';
import React, {useEffect, useRef} from 'react';
import DatePickerCore from './DatePickerCore';
import {type DatePickerProps, type DatePickerTemplateStyle} from './DatePickerTemplate';
import type DatePickerTemplate from './DatePickerTemplate';
import useComponentRef from '@hooks/useComponentRef';

const DatePickerBehavior: AquinoBehavior<DatePickerProps, typeof DatePickerTemplate, DatePickerTemplateStyle> = props => {
  const {Template, innerRef, ...templateProps} = props;

  const update = useUpdater();
  const {ref, events, eventManager} = useComponentRef<HTMLInputElement>(innerRef);

  const core = useNew(DatePickerCore, [props.value, props.onAction]);

  useEffect(() => {
    core.setInput(ref.current);
    core.subscribe(['value', 'yearsRange'], update);
    return () => {
      core.unsubscribe(['value', 'yearsRange'], update);
      core.destroy();
    };
  }, []);

  useEffect(() => {
    if (props.value !== core.value.get()) {
      core.setValue(props.value);
    }
  }, [props.value]);

  return <Template core={core} el={ref} events={events} {...templateProps} />;
};

export default DatePickerBehavior;
