import React from 'react';
import Button from '@components/button/Button';
import {FaCaretLeft, FaCaretRight} from 'react-icons/fa';
import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import {type DatePickerPanelProps} from '../DatePickerTemplate';

export interface DatePickerYearsProps extends DatePickerPanelProps {
  ratio: number;
}

export interface DatePickerYearsTemplateProps extends DatePickerYearsProps {
  updateDate: (year: number) => void;
}

const initialStyleValue = {
	panel: ['', {
		controls: ['', {
			decrement: '',
      increment: '',
		}],
		years: ['', {
			row: ['', {
        year: ['', {
          input: '',
        }],
        activeYear: '',
      }],
		}],
	}],
} satisfies Theme;

export type DatePickerYearsTemplateStyle = typeof initialStyleValue;

const DatePickerYearsTemplate = template<DatePickerYearsTemplateProps, HTMLDivElement, DatePickerYearsTemplateStyle>((props, style) => {
  const activeYear = props.core.getCurrentDate();
  const rangeOfYears = props.core.yearsRange.get() ?? [];
  const step = props.core.yearsStep.get() ?? 0;

  return (
    <div className={style?.panel[0]} aria-label='years panel' {...props.events}>
      <div className={style?.panel[1].controls[0]}>
        <Button onAction={props.core.decrementYear} className={style?.panel[1].controls[1].decrement}> 
          <FaCaretLeft /> 
        </Button>
        <Button onAction={props.core.incrementYear} className={style?.panel[1].controls[1].increment}> 
          <FaCaretRight /> 
        </Button>
      </div>
      <div className={style?.panel[1].years[0]}>
        {[...Array<number>(step / 4)].map((value, rowKey) => (
            <div className={style?.panel[1].years[1].row[0]} key={rowKey}>
              {[...Array<number>(4)].map((value, columnKey) => {
                const year = rangeOfYears[rowKey * 4 + columnKey];
                return (
                  <button
                    type='button'
                    key={year}
                    className={`
                      ${style?.panel[1].years[1].row[1].year[0] ?? ''}
                      ${year === activeYear.getYear() ? style?.panel[1].years[1].row[1].activeYear ?? '' : ''}
                    `}
                    onClick={() => props.updateDate(year)}
                    style={{width: props.ratio / 4}}
                  >
                    <input
                      name='year'
                      type='radio'
                      checked={year === activeYear.getYear()}
                      className={style?.panel[1].years[1].row[1].year[1].input}
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
}, initialStyleValue);

export default DatePickerYearsTemplate;
