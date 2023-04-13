/* eslint-disable react/prop-types */
import React, {useEffect, useRef, useState} from 'react';
import useNew from '@hooks/useNew';
import ComboBoxCore from './ComboBoxCore';
import {type ComboBoxProps} from './ComboBoxTemplate';
import type ComboBoxTemplate from './ComboBoxTemplate';
import {type AquinoBehavior} from '@internals/ThemeManager';
import useCreateComponentRef from '@hooks/useCreateComponentRef';

const ComboBoxBehavior: AquinoBehavior<ComboBoxProps, typeof ComboBoxTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;
  const [, setUpdater] = useState<boolean>(false);
  const {ref, events} = useCreateComponentRef<typeof ComboBoxBehavior>(innerRef);

  const core = useNew(ComboBoxCore, [
    props.value,
    props.items,
    props.allowSearch,
    props.onAction,
    setUpdater,
  ]);

  useEffect(() => {
    core.setInput(ref.current);
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

  return <Template core={core} el={ref} events={events} {...templateProps} />;
};

export default ComboBoxBehavior;
