/* eslint-disable react/prop-types */
import useUpdater from '@hooks/useUpdater';
import {type AquinoBehavior} from '@internals/ThemeManager';
import React, {useCallback, useEffect} from 'react';
import {DatePickerPanels} from '../DatePickerTemplate';
import {type DatePickerYearsProps} from './DatePickerYearsTemplate';
import type DatePickerYearsTemplate from './DatePickerYearsTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';

const DatePickerYearsBehavior: AquinoBehavior<DatePickerYearsProps, typeof DatePickerYearsTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;
  const [, update] = useUpdater();
  const {ref, events} = useCreateComponentRef<typeof DatePickerYearsBehavior>(innerRef);

  useEffect(() => {
    props.core.subscribe(['value', 'yearsRange', 'yearsStep'], update);
    return () => {
      props.core.unsubscribe(['value', 'yearsRange', 'yearsStep'], update);
    };
  }, []);

  const updateDate = useCallback((year: number) => {
    props.core.setDateByYear(year);
    props.setPanel(DatePickerPanels.MONTHS);
  }, []);

  return <Template el={ref} events={events} updateDate={updateDate} {...templateProps} />;
};

export default DatePickerYearsBehavior;
