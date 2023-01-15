import useNew from '@hooks/useNew';
import useUpdater from '@hooks/useUpdater';
import React, {useEffect, useRef} from 'react';
import {type DatePickerProps} from './DatePicker';
import DatePickerCore from './DatePickerCore';
import {type DatePickerTemplateProps} from './DatePickerTemplate';

interface DatePickerBehaviorProps extends DatePickerProps {
  Template: React.FC<DatePickerTemplateProps>;
}

const DatePickerBehavior: React.FC<DatePickerBehaviorProps> = props => {
  const {Template, ...templateProps} = props;

  const update = useUpdater();
  const inputRef = useRef<HTMLInputElement>(null);

  const core = useNew(DatePickerCore, [props.value, props.onAction]);

  useEffect(() => {
    core.setInput(inputRef.current);
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

  return <Template core={core} inputRef={inputRef} {...templateProps} />;
};

export default DatePickerBehavior;
