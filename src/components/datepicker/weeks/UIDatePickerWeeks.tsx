import React from "react";
import { UIDatePickerPanelProps } from "../UIDatePickerTemplate";
import UIDatePickerWeeksBehavior from "./UIDatePickerWeeksBehavior";
import UIDatePickerWeeksTemplate from "./UIDatePickerWeeksTemplate";

export interface UIDatePickerWeeksProps extends UIDatePickerPanelProps {
  ratio: number
}
                
const UIDatePickerWeeks: React.FC<UIDatePickerWeeksProps> = (props) => {
  return <UIDatePickerWeeksBehavior Template={UIDatePickerWeeksTemplate} {...props}  />
};

export default UIDatePickerWeeks