import React, {useEffect, useRef, useState} from 'react';
import useNew from '@hooks/useNew';
import ComboBoxCore from './common/ComboBoxCore';
import {type ComboBoxProps} from './template';
import type ComboBoxTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import useEventManager from '@hooks/useEventManager';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<ComboBoxProps, typeof ComboBoxTemplate>(props => {
  const {innerRef, ...templateProps} = props;
  const {ref, events} = useCreateComponentRef<B<ComboBoxProps, typeof ComboBoxTemplate>>(innerRef);
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

  return {
    core,
    el: ref,
    events,
    inputEvents,
    ...templateProps,
  };
});

export default Behavior;
