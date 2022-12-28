import React from "react";
import { UIDatePickerPanelProps } from "../UIDatePickerTemplate";
import UIDatePickerYearsBehavior from "./UIDatePickerYearsBehavior";
import UIDatePickerYearsTemplate from "./UIDatePickerYearsTemplate";

export interface UIDatePickerYearsProps extends UIDatePickerPanelProps {
  ratio: number
}

const UIDatePickerYears: React.FC<UIDatePickerYearsProps> = (props) => {
  return <UIDatePickerYearsBehavior Template={UIDatePickerYearsTemplate} {...props}  />
}

export default UIDatePickerYears