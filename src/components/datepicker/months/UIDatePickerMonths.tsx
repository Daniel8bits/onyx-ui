import React from "react";
import { UIDatePickerPanelProps } from "../UIDatePickerTemplate";
import UIDatePickerMonthsBehavior from "./UIDatePickerMonthsBehavior";
import UIDatePickerMonthsTemplate from "./UIDatePickerMonthsTemplate";

export interface UIDatePickerMonthsProps extends UIDatePickerPanelProps {
}
          
const UIDatePickerMonths: React.FC<UIDatePickerMonthsProps> = (props) => {
  return <UIDatePickerMonthsBehavior Template={UIDatePickerMonthsTemplate} {...props}  />
};

export default UIDatePickerMonths