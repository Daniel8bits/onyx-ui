import React from 'react'
import UIButton from "@components/button/UIButton"
import UIScrollContainer from "@components/scrollContainer/UIScrollContainer"
import UIDate from "../UIDate"
import { UIDatePickerPanels } from "../UIDatePickerTemplate"
import { UIDatePickerMonthsProps } from "./UIDatePickerMonths"

export interface UIDatePickerMonthsTemplateProps extends UIDatePickerMonthsProps {
  activeMonth: UIDate
  updateDate: (month: number) => void
}

const UIDatePickerMonthsTemplate: React.FC<UIDatePickerMonthsTemplateProps> = (props) => (
  <>
    <div className="year-control">
      <UIButton onAction={() => props.setPanel(UIDatePickerPanels.YEARS)}>
        {props.activeMonth.getYear()}
      </UIButton>
    </div>
    <UIScrollContainer className='months' maxHeight={235}>
      {
        [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro'
        ].map((value, key) => {
          return (
            <button
              type='button'
              key={value}
              className={`${key === props.activeMonth.getMonth() && 'active'}`}
              onClick={() => props.updateDate(key)}
            >
              {value}
            </button>
          )
        })
      }
    </UIScrollContainer>
  </>
)

export default UIDatePickerMonthsTemplate