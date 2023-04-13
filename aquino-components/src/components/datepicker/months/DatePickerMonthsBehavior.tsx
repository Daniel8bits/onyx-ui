/* eslint-disable react/prop-types */
import React, {useCallback, useEffect} from 'react';
import useUpdater from '@hooks/useUpdater';
import {type AquinoBehavior} from '@internals/ThemeManager';
import {DatePickerPanels} from '../DatePickerTemplate';
import {type DatePickerMonthsProps} from './DatePickerMonthsTemplate';
import type DatePickerMonthsTemplate from './DatePickerMonthsTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';

const DatePickerMonthsBehavior: AquinoBehavior<DatePickerMonthsProps, typeof DatePickerMonthsTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;

  const activeMonth = props.core.getCurrentDate();
  const [, update] = useUpdater();

  const {ref, events} = useCreateComponentRef<typeof DatePickerMonthsBehavior>(innerRef);

  useEffect(() => {
    props.core.subscribe(['value'], update);
    return () => {
      props.core.unsubscribe(['value'], update);
    };
  }, []);

  const updateDate = useCallback((month: number) => {
    props.core.setDateByMonth(month);
    props.setPanel(DatePickerPanels.WEEKS);
  }, []);

  return <Template el={ref} events={events} activeMonth={activeMonth} updateDate={updateDate} {...templateProps} />;
};

export default DatePickerMonthsBehavior;
