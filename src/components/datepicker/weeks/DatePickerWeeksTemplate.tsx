import React from 'react';
import Button from '@components/button/Button';
import {FaCaretLeft, FaCaretRight} from 'react-icons/fa';
import {type DatePickerWeeksProps} from './DatePickerWeeks';

const DatePickerWeeksTemplate: React.FC<DatePickerWeeksProps> = props => {
  const currentMonth = props.core.getCurrentDate();
  const monthDays = props.core.monthDays.get() ?? [];

  return (
    <div className='weeks-panel' aria-label='weeks panel'>
      <div className='month-control'>
        <Button onAction={props.core.decrementMonth}> <FaCaretLeft /> </Button>
        <Button onAction={() => props.setPanel(1)}>
          {`${currentMonth.format('<mE>, <y>')}`}
        </Button>
        <Button onAction={props.core.incrementMonth}> <FaCaretRight /> </Button>
      </div>
      <div className='days-of-week'>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((value, key) => (
            <div key={`${value}${key}`} style={{width: props.ratio / 7}}>
              {value}
            </div>
          ))}
      </div>
      {monthDays.map((week, weekKey) => (
          <div className='week' key={['D0', 'S1', 'T2', 'Q3', 'Q4', 'S5', 'S6'][weekKey]}>
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
                  className={`${currentMonth.getDay() === day ? 'active' : ''} ${day < 0 || day > 100 ? 'from-other-month' : ''}`}
                  onClick={() => props.core.setDateByDay(day)}
                  aria-label={currentMonth.format('<xmE> <xdE>, <x>', formatVariables)}
                  style={{width: props.ratio / 7}}
                >
                  <input
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
};

export default DatePickerWeeksTemplate;
