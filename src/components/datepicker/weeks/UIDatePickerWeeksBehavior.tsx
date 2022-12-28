import useUpdater from '@hooks/useUpdater';
import React, { useEffect } from 'react'
import { UIDatePickerWeeksProps } from './UIDatePickerWeeks';

interface UIDatePickerWeeksBehaviorProps extends UIDatePickerWeeksProps {
  Template: React.FC<UIDatePickerWeeksProps>
}

const UIDatePickerWeeksBehavior: React.FC<UIDatePickerWeeksBehaviorProps> = (props) => {

  const {Template, ...templateProps} = props
  const update = useUpdater()

  useEffect(() => {
    props.core.subscribe(['value', 'monthDays'], update)
    return () => {
      props.core.unsubscribe(['value', 'monthDays'], update)
    }
  }, [])

  return <Template {...templateProps}  />
};

export default UIDatePickerWeeksBehavior