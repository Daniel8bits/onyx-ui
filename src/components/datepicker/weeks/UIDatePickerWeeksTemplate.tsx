import React from 'react'
import UIButton from "@components/button/UIButton"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import { UIDatePickerWeeksProps } from "./UIDatePickerWeeks"

const UIDatePickerWeeksTemplate: React.FC<UIDatePickerWeeksProps> = (props) => {

  const currentMonth = props.core.getCurrentDate()
  const monthDays = props.core.monthDays.get() ?? []

  return (
    <>
      <div className="month-control">
        <UIButton onAction={props.core.decrementMonth}> <FaCaretLeft  /> </UIButton>
        <UIButton onAction={() => props.setPanel(1)}>
          {`${currentMonth.getMonthName()}, ${currentMonth.getYear()}`}
        </UIButton>
        <UIButton onAction={props.core.incrementMonth}> <FaCaretRight  /> </UIButton>
      </div>
      <div className="days-of-week">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((value, key) => {
          return (
            <div key={`${value}${key}`} style={{width: props.ratio/7}}>
              {value}
            </div>
          )
        })}
      </div>
      {monthDays.map((week, weekKey) => {
        return (
          <div className="week" key={['D0', 'S1', 'T2', 'Q3', 'Q4', 'S5', 'S6'][weekKey]}>
            {week.map((day, dayKey) => {
              let value = props.core.normalizeWeekDay(day)
              return (
                <button
                  type='button'
                  key={day}
                  className={`${currentMonth.getDay() === day ? 'active' : ''} ${day < 0 || day > 100 ? 'from-other-month' : ''}`}
                  onClick={() => props.core.setDateByDay(day)}
                  style={{width: props.ratio/7}}
                >
                  {value}
                </button>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

export default UIDatePickerWeeksTemplate