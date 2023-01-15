import useUpdater from '@hooks/useUpdater';
import React, {useCallback, useEffect} from 'react';
import {DatePickerPanels} from '../DatePickerTemplate';
import {type DatePickerYearsProps} from './DatePickerYears';
import {type DatePickerYearsTemplateProps} from './DatePickerYearsTemplate';

interface DatePickerYearsBehaviorProps extends DatePickerYearsProps {
  Template: React.FC<DatePickerYearsTemplateProps>;
}

const DatePickerYearsBehavior: React.FC<DatePickerYearsBehaviorProps> = props => {
  const {Template, ...templateProps} = props;
  const update = useUpdater();

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

  return <Template updateDate={updateDate} {...templateProps} />;
};

export default DatePickerYearsBehavior;
