/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import useUpdater from '@hooks/useUpdater';
import {type AquinoBehavior} from '@internals/ThemeManager';
import {type DatePickerWeeksProps} from './DatePickerWeeksTemplate';
import type DatePickerWeeksTemplate from './DatePickerWeeksTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';

const DatePickerWeeksBehavior: AquinoBehavior<DatePickerWeeksProps, typeof DatePickerWeeksTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;
  const [, update] = useUpdater();
  const {ref, events} = useCreateComponentRef<typeof DatePickerWeeksBehavior>(innerRef);

  useEffect(() => {
    props.core.subscribe(['value', 'monthDays'], update);
    return () => {
      props.core.unsubscribe(['value', 'monthDays'], update);
    };
  }, []);

  return <Template el={ref} events={events} {...templateProps} />;
};

export default DatePickerWeeksBehavior;
