import React, {useEffect, useRef, useState} from 'react';
import useNew from '@hooks/useNew';
import ComboBoxCore from './ComboBoxCore';
import {type ComboBoxProps} from './ComboBoxTemplate';
import type ComboBoxTemplate from './ComboBoxTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import useEventManager from '@hooks/useEventManager';
import behavior from '@internals/behavior';

const ComboBoxBehavior = behavior<ComboBoxProps, typeof ComboBoxTemplate>(props => {
  const {Template, innerRef, ...templateProps} = props;
  const {ref, events} = useCreateComponentRef<typeof ComboBoxBehavior>(innerRef);
  const {
    events: inputEvents, 
    eventManager: inputEventManager,
  } = useEventManager();

  const core = useNew(ComboBoxCore, [{
    value: props.value,
		items: props.items,
		allowSearch: props.allowSearch,
		actionTrigger: props.onAction,
		inputEventManager,
  }]);

  useEffect(() => {
    core.setInput(ref.current);
  }, []);

  useEffect(() => {
    if (props.value !== core.getValue()) {
      core.setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    core.setItems(props.items);
  }, [props.items]);

  useEffect(() => {
    core.setAllowSearch(props.allowSearch ?? false);
  }, [props.allowSearch]);

  return (
    <Template 
      core={core} 
      el={ref} 
      events={events} 
      inputEvents={inputEvents} 
      {...templateProps} 
    />
  );
});

export default ComboBoxBehavior;
