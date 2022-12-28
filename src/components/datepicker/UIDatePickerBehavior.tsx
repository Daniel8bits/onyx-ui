import useNew from '@hooks/useNew';
import useUpdater from '@hooks/useUpdater';
import React, { useEffect, useRef } from 'react'
import { UIDatePickerProps } from './UIDatePicker';
import UIDatePickerCore from './UIDatePickerCore';
import { UIDatePickerTemplateProps } from './UIDatePickerTemplate';

interface UIDatePickerBehaviorProps extends UIDatePickerProps {
  Template: React.FC<UIDatePickerTemplateProps>
}

const UIDatePickerBehavior: React.FC<UIDatePickerBehaviorProps> = (props) => {

  const {Template, ...templateProps} = props

  const update = useUpdater()
  const inputRef = useRef<HTMLInputElement>(null)

  const core = useNew(UIDatePickerCore, [props.value, props.onAction])

  useEffect(() => {
    core.setInput(inputRef.current)
    core.subscribe(['value', 'yearsRange'], update)
    return () => {
      core.unsubscribe(['value', 'yearsRange'], update)
      core.destroy()
    }
  }, []);

  useEffect(() => {
    if(props.value !== core.value.get())
      core.setValue(props.value)
  }, [props.value])

  
  return <Template core={core} inputRef={inputRef} {...templateProps}  />
};

export default UIDatePickerBehavior