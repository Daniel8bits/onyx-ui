import React from 'react';
import Button from '@components/button/Button';
import ScrollContainer from '@components/scrollContainer/ScrollContainer';
import type ExtendedDate from '../ExtendedDate';
import {DatePickerPanels} from '../DatePickerTemplate';
import {type DatePickerMonthsProps} from './DatePickerMonths';

export interface DatePickerMonthsTemplateProps extends DatePickerMonthsProps {
  activeMonth: ExtendedDate;
  updateDate: (month: number) => void;
}

const DatePickerMonthsTemplate: React.FC<DatePickerMonthsTemplateProps> = props => (
  <>
    <div className='year-control'>
      <Button onAction={() => props.setPanel(DatePickerPanels.YEARS)}>
        {props.activeMonth.getYear()}
      </Button>
    </div>
    <ScrollContainer className='months' maxHeight={235}>
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
          'Dezembro',
        ].map((value, key) => (
            <button
              type='button'
              key={value}
              className={`${key === props.activeMonth.getMonth() ? 'active' : ''}`}
              onClick={() => props.updateDate(key)}
            >
              {value}
            </button>
          ))
      }
    </ScrollContainer>
  </>
);

export default DatePickerMonthsTemplate;
