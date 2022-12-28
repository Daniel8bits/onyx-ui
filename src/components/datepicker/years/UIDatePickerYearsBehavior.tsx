import useUpdater from "@hooks/useUpdater";
import React, { useCallback, useEffect } from "react";
import { UIDatePickerPanels } from "../UIDatePickerTemplate";
import { UIDatePickerYearsProps } from "./UIDatePickerYears";
import { UIDatePickerYearsTemplateProps } from "./UIDatePickerYearsTemplate";

interface UIDatePickerYearsBehaviorProps extends UIDatePickerYearsProps {
  Template: React.FC<UIDatePickerYearsTemplateProps>
}

const UIDatePickerYearsBehavior: React.FC<UIDatePickerYearsBehaviorProps> = (props) => {

  const {Template, ...templateProps} = props
  const update = useUpdater()

  useEffect(() => {
    props.core.subscribe(['value', 'yearsRange', 'yearsStep'], update)
    return () => {
      props.core.unsubscribe(['value', 'yearsRange', 'yearsStep'], update)
    }
  }, [])

  const updateDate = useCallback((year: number) => {
    props.core.setDateByYear(year)
    props.setPanel(UIDatePickerPanels.MONTHS)
  }, [])
  
  return <Template updateDate={updateDate} {...templateProps}  />
  
};

export default UIDatePickerYearsBehavior