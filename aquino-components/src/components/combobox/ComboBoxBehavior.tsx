import React, {useEffect, useRef, useState} from 'react';
import useNew from '@hooks/useNew';
import {type ComboBoxProps} from './ComboBox';
import ComboBoxCore from './ComboBoxCore';
import {type ComboBoxTemplateProps} from './ComboBoxTemplate';

interface ComboBoxBehaviorProps extends ComboBoxProps {
  Template: React.FC<ComboBoxTemplateProps>;
}

const ComboBoxBehavior: React.FC<ComboBoxBehaviorProps> = props => {
  const {Template, className, ...templateProps} = props;
  const [, setUpdater] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const core = useNew(ComboBoxCore, [
    props.value,
    props.items,
    props.allowSearch,
    props.onAction,
    setUpdater,
  ]);

  useEffect(() => {
    core.setInput(inputRef.current);
  }, []);

  useEffect(() => {
    if (props.value !== core.value) {
      core.setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    core.setItems(props.items);
  }, [props.items]);

  useEffect(() => {
    core.setAllowSearch(props.allowSearch ?? false);
  }, [props.allowSearch]);

  const classes = `ui-combobox ${props.allowSearch ? 'allow-search' : ''} ${props.template ?? ''} ${className ?? ''}`;

  return <Template core={core} inputRef={inputRef} className={classes} {...templateProps} />;
};

export default ComboBoxBehavior;
