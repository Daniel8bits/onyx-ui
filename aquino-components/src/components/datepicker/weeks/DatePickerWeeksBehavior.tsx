/* eslint-disable react/prop-types */
import useUpdater from '@hooks/useUpdater';
import {type AquinoBehavior} from '@internals/ThemeManager';
import React, {useEffect} from 'react';
import {type DatePickerWeeksProps, type DatePickerWeeksTemplateStyle} from './DatePickerWeeksTemplate';
import type DatePickerWeeksTemplate from './DatePickerWeeksTemplate';
import useComponentRef from '@hooks/useComponentRef';

const DatePickerWeeksBehavior: AquinoBehavior<DatePickerWeeksProps, typeof DatePickerWeeksTemplate, DatePickerWeeksTemplateStyle> = props => {
  const {Template, innerRef, ...templateProps} = props;
  const update = useUpdater();
  const {ref, events, eventManager} = useComponentRef<HTMLDivElement>(innerRef);

  useEffect(() => {
    props.core.subscribe(['value', 'monthDays'], update);
    return () => {
      props.core.unsubscribe(['value', 'monthDays'], update);
    };
  }, []);

  return <Template el={ref} events={events} {...templateProps} />;
};

export default DatePickerWeeksBehavior;
