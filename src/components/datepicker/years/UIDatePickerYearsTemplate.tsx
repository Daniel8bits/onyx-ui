import React from 'react'
import UIButton from "@components/button/UIButton"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import { UIDatePickerYearsProps } from "./UIDatePickerYears"

export interface UIDatePickerYearsTemplateProps extends UIDatePickerYearsProps {
  updateDate: (year: number) => void
}

const UIDatePickerYearsTemplate: React.FC<UIDatePickerYearsTemplateProps> = (props) => {

  const activeYear = props.core.getCurrentDate()
  const rangeOfYears = props.core.yearsRange.get() ?? []
  const step = props.core.yearsStep.get() ?? 0

  return (
    <div className='years-panel'>
      <div className='years-range-control'>
        <UIButton onAction={props.core.decrementYear}> <FaCaretLeft  /> </UIButton>
        <UIButton onAction={props.core.incrementYear}> <FaCaretRight  /> </UIButton>
      </div>
      <div className="years">
        {[...Array(step/4)].map((value, rowKey) => {
          return (
            <div className='year-row'>
              {[...Array(4)].map((value, columnKey) => {
                const year = rangeOfYears[rowKey*4+columnKey]
                return (
                  <button
                    type='button'
                    key={year}
                    className={`${year === activeYear.getYear() && 'active'}`}
                    onClick={() => props.updateDate(year)}
                    style={{width: props.ratio/4}}
                  >
                    {year}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UIDatePickerYearsTemplate