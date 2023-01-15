import React from 'react';
import Button from '@components/button/Button';
import {FaCaretLeft, FaCaretRight} from 'react-icons/fa';
import {type DatePickerWeeksProps} from './DatePickerWeeks';

const DatePickerWeeksTemplate: React.FC<DatePickerWeeksProps> = props => {
  const currentMonth = props.core.getCurrentDate();
  const monthDays = props.core.monthDays.get() ?? [];

  return (
    <>
      <div className='month-control'>
        <Button onAction={props.core.decrementMonth}> <FaCaretLeft /> </Button>
        <Button onAction={() => props.setPanel(1)}>
          {`${currentMonth.getMonthName()}, ${currentMonth.getYear()}`}
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
              return (
                <button
                  type='button'
                  key={day}
                  className={`${currentMonth.getDay() === day ? 'active' : ''} ${day < 0 || day > 100 ? 'from-other-month' : ''}`}
                  onClick={() => props.core.setDateByDay(day)}
                  style={{width: props.ratio / 7}}
                >
                  {value}
                </button>
              );
            })}
          </div>
        ))}
    </>
  );
};

export default DatePickerWeeksTemplate;
