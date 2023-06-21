import React from 'react';
import Button from '@components/Button';
import {FaCaretLeft, FaCaretRight} from 'react-icons/fa';
import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import {type DatePickerPanelProps} from '../template';

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

export default template<
  DatePickerYearsTemplateProps, 
  HTMLDivElement, 
  DatePickerYearsTemplateStyle
>({
  name: 'datepicker-years',
  jsx(props, data) {
    const {theme, dataAquino} = data;
    const activeYear = props.core.getCurrentDate();
    const rangeOfYears = props.core.yearsRange ?? [];
    const step = props.core.yearsStep ?? 0;

    return (
      <div data-aquino={dataAquino} className={theme?.panel[0]} aria-label='years panel' {...props.events}>
        <div className={data.theme?.panel[1].controls[0]}>
          <Button onAction={props.core.decrementYear} className={theme?.panel[1].controls[1].decrement}> 
            <FaCaretLeft /> 
          </Button>
          <Button onAction={props.core.incrementYear} className={theme?.panel[1].controls[1].increment}> 
            <FaCaretRight /> 
          </Button>
        </div>
        <div className={theme?.panel[1].years[0]}>
          {[...Array<number>(step / 4)].map((value, rowKey) => (
              <div className={theme?.panel[1].years[1].row[0]} key={rowKey}>
                {[...Array<number>(4)].map((value, columnKey) => {
                  const year = rangeOfYears[rowKey * 4 + columnKey];
                  return (
                    <button
                      type='button'
                      key={year}
                      className={`
                        ${theme?.panel[1].years[1].row[1].year[0] ?? ''}
                        ${year === activeYear.getYear() ? theme?.panel[1].years[1].row[1].activeYear ?? '' : ''}
                      `}
                      onClick={() => props.updateDate(year)}
                      style={{width: props.ratio / 4}}
                    >
                      <input
                        name='year'
                        type='radio'
                        checked={year === activeYear.getYear()}
                        className={theme?.panel[1].years[1].row[1].year[1].input}
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
  }, 
  theme: initialStyleValue,
});
