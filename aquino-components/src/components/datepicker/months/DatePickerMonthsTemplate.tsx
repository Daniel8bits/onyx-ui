import React from 'react';
import Button from '@components/button/Button';
import ScrollContainer from '@components/scrollContainer/ScrollContainer';
import type ExtendedDate from '../ExtendedDate';
import {type DatePickerPanelProps, DatePickerPanels} from '../DatePickerTemplate';
import {type Theme} from '@internals/ThemeManager';
import template from '@internals/template';

export interface DatePickerMonthsProps extends DatePickerPanelProps {
}

export interface DatePickerMonthsTemplateProps extends DatePickerMonthsProps {
  activeMonth: ExtendedDate;
  updateDate: (month: number) => void;
}

const initialStyleValue = {
	panel: ['', {
		controls: ['', {
			yearsButton: '',		
		}],
		month: ['', {
			input: '',
		}],
    activeMonth: '',
	}],
} satisfies Theme;

export type DatePickerMonthsTemplateStyle = typeof initialStyleValue;

const DatePickerMonthsTemplate = template<DatePickerMonthsTemplateProps, HTMLDivElement, DatePickerMonthsTemplateStyle>((props, style) => (
  <div className={style?.panel[0]} aria-label='months panel' {...props.events}>
    <div className={style?.panel[1].controls[0]}>
      <Button onAction={() => props.setPanel(DatePickerPanels.YEARS)} className={style?.panel[1].controls[1].yearsButton}>
        {props.activeMonth.getYear()}
      </Button>
    </div>
    <ScrollContainer>
      {
        [...Array<number>(12)].map((v, i) => i).map((value, key) => (
            <button
              type='button'
              key={value}
              className={`
                ${style?.panel[1].month[0] ?? ''}
                ${key === props.activeMonth.getMonth() ? style?.panel[1].activeMonth ?? '' : ''}
              `}
              onClick={() => props.updateDate(key)}
            >
              <input
                name='month'
                type='radio'
                className={style?.panel[1].month[1].input}
                checked={key === props.activeMonth.getMonth()}
                readOnly
              />
              {props.activeMonth.format('<xmE>', [value])}
            </button>
          ))
      }
    </ScrollContainer>
  </div>
), initialStyleValue);

export default DatePickerMonthsTemplate;
