import React from 'react';
import Button from '@components/Button';
import ScrollContainer from '@components/ScrollContainer';
import type ExtendedDate from '../common/ExtendedDate';
import {type DatePickerPanelProps, DatePickerPanels} from '../template';
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

export default template<
  DatePickerMonthsTemplateProps, 
  HTMLDivElement, 
  DatePickerMonthsTemplateStyle
>({
  name: 'datepicker-months',
  jsx: (props, data) => (
    <div className={data.theme?.panel[0]} aria-label='months panel' {...props.events}>
      <div className={data.theme?.panel[1].controls[0]}>
        <Button onAction={() => props.setPanel(DatePickerPanels.YEARS)} className={data.theme?.panel[1].controls[1].yearsButton}>
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
                  ${data.theme?.panel[1].month[0] ?? ''}
                  ${key === props.activeMonth.getMonth() ? data.theme?.panel[1].activeMonth ?? '' : ''}
                `}
                onClick={() => props.updateDate(key)}
              >
                <input
                  name='month'
                  type='radio'
                  className={data.theme?.panel[1].month[1].input}
                  checked={key === props.activeMonth.getMonth()}
                  readOnly
                />
                {props.activeMonth.format('<xmE>', [value])}
              </button>
            ))
        }
      </ScrollContainer>
    </div>
  ),
  theme: initialStyleValue,
});
