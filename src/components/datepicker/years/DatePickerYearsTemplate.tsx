import React from 'react';
import Button from '@components/button/Button';
import {FaCaretLeft, FaCaretRight} from 'react-icons/fa';
import {type DatePickerYearsProps} from './DatePickerYears';

export interface DatePickerYearsTemplateProps extends DatePickerYearsProps {
  updateDate: (year: number) => void;
}

const DatePickerYearsTemplate: React.FC<DatePickerYearsTemplateProps> = props => {
  const activeYear = props.core.getCurrentDate();
  const rangeOfYears = props.core.yearsRange.get() ?? [];
  const step = props.core.yearsStep.get() ?? 0;

  return (
    <div className='years-panel' aria-label='years panel'>
      <div className='years-range-control'>
        <Button onAction={props.core.decrementYear}> <FaCaretLeft /> </Button>
        <Button onAction={props.core.incrementYear}> <FaCaretRight /> </Button>
      </div>
      <div className='years'>
        {[...Array<number>(step / 4)].map((value, rowKey) => (
            <div className='year-row' key={rowKey}>
              {[...Array<number>(4)].map((value, columnKey) => {
                const year = rangeOfYears[rowKey * 4 + columnKey];
                return (
                  <button
                    type='button'
                    key={year}
                    className={`${year === activeYear.getYear() ? 'active' : ''}`}
                    onClick={() => props.updateDate(year)}
                    style={{width: props.ratio / 4}}
                  >
                    <input
                      name='year'
                      type='radio'
                      checked={year === activeYear.getYear()}
                      readOnly
                    />
                    {year}
                  </button>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DatePickerYearsTemplate;
