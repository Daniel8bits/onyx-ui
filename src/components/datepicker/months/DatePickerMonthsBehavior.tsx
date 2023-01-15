import useUpdater from '@hooks/useUpdater';
import React, {useCallback, useEffect} from 'react';
import {DatePickerPanels} from '../DatePickerTemplate';
import {type DatePickerMonthsProps} from './DatePickerMonths';
import {type DatePickerMonthsTemplateProps} from './DatePickerMonthsTemplate';

interface DatePickerMonthsBehaviorProps extends DatePickerMonthsProps {
  Template: React.FC<DatePickerMonthsTemplateProps>;
}

const DatePickerMonthsBehavior: React.FC<DatePickerMonthsBehaviorProps> = props => {
  const {Template, ...templateProps} = props;

  const activeMonth = props.core.getCurrentDate();
  const update = useUpdater();

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

  return <Template activeMonth={activeMonth} updateDate={updateDate} {...templateProps} />;
};

export default DatePickerMonthsBehavior;
