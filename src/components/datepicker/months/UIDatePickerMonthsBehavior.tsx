import useUpdater from "@hooks/useUpdater"
import React, { useCallback, useEffect } from "react"
import { UIDatePickerPanels } from "../UIDatePickerTemplate"
import { UIDatePickerMonthsProps } from "./UIDatePickerMonths"
import { UIDatePickerMonthsTemplateProps } from "./UIDatePickerMonthsTemplate"

interface UIDatePickerMonthsBehaviorProps extends UIDatePickerMonthsProps {
  Template: React.FC<UIDatePickerMonthsTemplateProps>
}

const UIDatePickerMonthsBehavior: React.FC<UIDatePickerMonthsBehaviorProps> = (props) => {

  const {Template, ...templateProps} = props

  const activeMonth = props.core.getCurrentDate()
  const update = useUpdater()

  useEffect(() => {
    props.core.subscribe(['value'], update)
    return () => {
      props.core.unsubscribe(['value'], update)
    }
  }, [])
            
  const updateDate = useCallback((month: number) => {
    props.core.setDateByMonth(month)
    props.setPanel(UIDatePickerPanels.WEEKS)
  }, [])

  return <Template activeMonth={activeMonth} updateDate={updateDate} {...templateProps}  />

}

export default UIDatePickerMonthsBehavior