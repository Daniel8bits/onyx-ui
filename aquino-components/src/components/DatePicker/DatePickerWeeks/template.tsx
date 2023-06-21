import React from 'react';
import Button from '@components/Button';
import {FaCaretLeft, FaCaretRight} from 'react-icons/fa';
import template from '@internals/template';
import {type DatePickerPanelProps} from '../template';
import {type Theme} from '@internals/ThemeManager';

export interface DatePickerWeeksProps extends DatePickerPanelProps {
  ratio: number;
}

const initialStyleValue = {
	panel: ['', {
		controls: ['', {
			decrement: ['', {
        icon: '',
      }],
			monthsButton: '',
			increment: ['', {
        icon: '',
      }],
		}],
		weekDays: ['', {
			day: '',		
		}],
		week: ['', {
			day: ['', {
        input: '',
      }],
      activeDay: '',
      dayFromOtherMonth: '',
		}],
	}],
} satisfies Theme;

export type DatePickerWeeksTemplateStyle = typeof initialStyleValue;

export default template<
  DatePickerWeeksProps, 
  HTMLDivElement, 
  DatePickerWeeksTemplateStyle
>({
  name: 'datepicker-weeks',
  jsx(props, data) {
    const currentMonth = props.core.getCurrentDate();
    const monthDays = props.core.monthDays ?? [];

    return (
      <div className={data.theme?.panel[0]} aria-label='weeks panel' {...props.events}>
        <div className={data.theme?.panel[1].controls[0]}>
          <Button onAction={props.core.decrementMonth} className={data.theme?.panel[1].controls[1].decrement[0]}> 
            <FaCaretLeft className={data.theme?.panel[1].controls[1].increment[1].icon} /> 
          </Button>
          <Button onAction={() => props.setPanel(1)} className={data.theme?.panel[1].controls[1].monthsButton}>
            {`${currentMonth.format('<mE>, <y>')}`}
          </Button>
          <Button onAction={props.core.incrementMonth} className={data.theme?.panel[1].controls[1].increment[0]}> 
            <FaCaretRight className={data.theme?.panel[1].controls[1].increment[1].icon} /> 
          </Button>
        </div>
        <div className={data.theme?.panel[1].weekDays[0]}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((value, key) => (
              <div key={`${value}${key}`} className={data.theme?.panel[1].weekDays[1].day} style={{width: props.ratio / 7}}>
                {value}
              </div>
            ))}
        </div>
        {monthDays.map((week, weekKey) => (
            <div className={data.theme?.panel[1].week[0]} key={['D0', 'S1', 'T2', 'Q3', 'Q4', 'S5', 'S6'][weekKey]}>
              {week.map((day, dayKey) => {
                const value = props.core.normalizeWeekDay(day);
                const m = currentMonth.getMonth();
                const y = m === 11 && day > 100 ? currentMonth.getYear() + 1 : m === 0 && day < 0 ? currentMonth.getYear() - 1 : currentMonth.getYear();
                const formatVariables = day > 100 ? [(m + 1) % 12, day - 100, y] : day < 0 ? [(12 + m - 1) % 12, Math.abs(day), y] : [m, day, y];
                // .console.log(day, formatVariables);
                return (
                  <button 
                    key={day} 
                    type='button'
                    className={`
                      ${data.theme?.panel[1].week[1].day[0] ?? ''}
                      ${currentMonth.getDay() === day ? data.theme?.panel[1].week[1].activeDay ?? '' : ''} 
                      ${day < 0 || day > 100 ? data.theme?.panel[1].week[1].dayFromOtherMonth ?? '' : ''}
                    `}
                    onClick={() => props.core.setDateByDay(day)}
                    aria-label={currentMonth.format('<xmE> <xdE>, <x>', formatVariables)}
                    style={{width: props.ratio / 7}}
                  >
                    <input
                      className={data.theme?.panel[1].week[1].day[1].input}
                      name='week-day'
                      type='radio'
                      checked={currentMonth.getDay() === day}
                      readOnly
                    />
                    {value}
                  </button>
                );
              })}
            </div>
          ))}
      </div>
    );
  }, 
  theme: initialStyleValue,
});
