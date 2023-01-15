import useUpdater from '@hooks/useUpdater';
import React, {useEffect} from 'react';
import {type DatePickerWeeksProps} from './DatePickerWeeks';

interface DatePickerWeeksBehaviorProps extends DatePickerWeeksProps {
  Template: React.FC<DatePickerWeeksProps>;
}

const DatePickerWeeksBehavior: React.FC<DatePickerWeeksBehaviorProps> = props => {
  const {Template, ...templateProps} = props;
  const update = useUpdater();

  useEffect(() => {
    props.core.subscribe(['value', 'monthDays'], update);
    return () => {
      props.core.unsubscribe(['value', 'monthDays'], update);
    };
  }, []);

  return <Template {...templateProps} />;
};

export default DatePickerWeeksBehavior;
