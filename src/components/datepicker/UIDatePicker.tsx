import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef
} from 'react';
import UITextField, { UITextFieldProps } from '@components/textfield/UITextField'
import UIPopOver from '@components/popover/UIPopOver'
import UIButton from '@components/button/UIButton'
import usePopOver from '@hooks/usePopOver';

import {
  FaCalendarAlt,
  FaCaretLeft,
  FaCaretRight
} from 'react-icons/fa'

import UIScrollContainer from '@components/scrollContainer/UIScrollContainer';
import UIDate from './UIDate';
import useNew from '@hooks/useNew';
import UIDatePickerCore from './UIDatePickerCore';
import useUpdater from '@hooks/useUpdater';

    
enum UIDatePickerPanels {
  WEEKS = 0,
  MONTHS = 1,
  YEARS = 2
}
    
interface UIDatePickerPanelProps {
  setPanel: (panel: UIDatePickerPanels) => void
  core: UIDatePickerCore
}

interface UIDatePickerYears extends UIDatePickerPanelProps {
  ratio: number
}
    
const UIDatePickerYears: React.FC<UIDatePickerYears> = (props) => {

  const activeYear = props.core.getCurrentDate()

  const rangeOfYears = props.core.yearsRange.get() ?? []
  const step = props.core.yearsStep.get() ?? 0

  const update = useUpdater()

  useEffect(() => {
    props.core.subscribe(['value', 'yearsRange', 'yearsStep'], update)
    return () => {
      props.core.unsubscribe(['value', 'yearsRange', 'yearsStep'], update)
    }
  }, [])

  const updateDate = useCallback((year: number) => {
    props.core.setDateByYear(year)
    props.setPanel(UIDatePickerPanels.MONTHS)
  }, [])
  
  return (
    <div className='years-panel'>
      <div className='years-range-control'>
        <UIButton onAction={props.core.decrementYear}> <FaCaretLeft  /> </UIButton>
        <UIButton onAction={props.core.incrementYear}> <FaCaretRight  /> </UIButton>
      </div>
      <div className="years">
        {[...Array(step/4)].map((value, rowKey) => {
          return (
            <div className='year-row'>
              {[...Array(4)].map((value, columnKey) => {
                const year = rangeOfYears[rowKey*4+columnKey]
                return (
                  <button
                    type='button'
                    key={year}
                    className={`${year === activeYear.getYear() && 'active'}`}
                    onClick={() => updateDate(year)}
                    style={{width: props.ratio/4}}
                  >
                    {year}
                  </button>
                )
              })}
            </div>
          )
        })}
        
      </div>
    </div>
  );
};



interface UIDatePickerMonthsProps extends UIDatePickerPanelProps {
}
          
const UIDatePickerMonths: React.FC<UIDatePickerMonthsProps> = (props) => {

  const activeMonth = props.core.getCurrentDate()
  const update = useUpdater()

  useEffect(() => {
    props.core.subscribe(['value'], update)
    return () => {
      props.core.unsubscribe(['value'], update)
    }
  }, [])
            
  const updateDate = useCallback((month: number) => {
    props.core.setDateByMonth(month)
    props.setPanel(UIDatePickerPanels.WEEKS)
  }, [])

  return (
    <>
      <div className="year-control">
        <UIButton
          template="secondary"
          onAction={() => props.setPanel(UIDatePickerPanels.YEARS)}
        >
          {String(activeMonth.getYear())}
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
                className={`${key === activeMonth.getMonth() && 'active'}`}
                onClick={() => updateDate(key)}
              >
                {value}
              </button>
            )
          })
        }
      </UIScrollContainer>
    </>
  );
};




interface UIDatePickerWeeksProps extends UIDatePickerPanelProps {
  ratio: number
}
                
const UIDatePickerWeeks: React.FC<UIDatePickerWeeksProps> = (props) => {

  const currentMonth = props.core.getCurrentDate()
  const monthDays = props.core.monthDays.get() ?? []
  const update = useUpdater()

  useEffect(() => {
    props.core.subscribe(['value', 'monthDays'], update)
    return () => {
      props.core.unsubscribe(['value', 'monthDays'], update)
    }
  }, [])

  return (
    <>
      <div className="month-control">
        <UIButton onAction={props.core.decrementMonth}> <FaCaretLeft  /> </UIButton>
        <UIButton template="secondary" onAction={() => props.setPanel(1)}>
          {`${currentMonth.getMonthName()}, ${currentMonth.getYear()}`}
        </UIButton>
        <UIButton onAction={props.core.incrementMonth}> <FaCaretRight  /> </UIButton>
      </div>
      <div className="days-of-week">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((value, key) => {
          return (
            <div key={`${value}${key}`} style={{width: props.ratio/7}}>
              {value}
            </div>
          )
        })}
      </div>
      {monthDays.map((week, weekKey) => {
        return (
          <div className="week" key={['D0', 'S1', 'T2', 'Q3', 'Q4', 'S5', 'S6'][weekKey]}>
            {week.map((day, dayKey) => {
              let value = props.core.normalizeWeekDay(day)
              return (
                <button
                  type='button'
                  key={day}
                  className={`${currentMonth.getDay() === day ? 'active' : ''} ${day < 0 || day > 100 ? 'from-other-month' : ''}`}
                  onClick={() => props.core.setDateByDay(day)}
                  style={{width: props.ratio/7}}
                >
                  {value}
                </button>
              )
            })}
          </div>
        )
      })}
    </>
  );
};



interface UIDatePickerProps extends Override<UITextFieldProps, {
  value: UIDate
  onAction: (value: UIDate | ((oldValue: UIDate) => UIDate)) => void
}> {
}

const UIDatePicker: React.FC<UIDatePickerProps> = (props) => {
  
  const POPOVER_SIZE = {
    WIDTH: 270,
    HEIGHT: 315
  }

  const update = useUpdater()
  const [panel, setPanel] = useState<UIDatePickerPanels>(UIDatePickerPanels.WEEKS)
  const inputRef = useRef<HTMLInputElement>(null)
  const iconButtonRef = useRef<HTMLDivElement>(null)
  const popOverId = `${props.id.trim()}__popOver`
  const {open} = usePopOver(popOverId)
  const {
    onAction,
    onMouseUp,
    onKeyDown,
    value,
    mask,
    className,
    ...inputTextProps 
  } = props;

  const core = useNew(UIDatePickerCore, [value, onAction])

  useEffect(() => {
    core.setInput(inputRef.current)
    core.subscribe(['value', 'yearsRange'], update)
    return () => {
      core.unsubscribe(['value', 'yearsRange'], update)
      core.destroy()
    }
  }, []);

  useEffect(() => {
    if(value !== core.value.get())
      core.setValue(value)
  }, [value])

  const currentPanel = useMemo<JSX.Element>(() => {
    const panelProps = {
      value: props.value,
      ratio: POPOVER_SIZE.WIDTH,
      setPanel,
      setDate: onAction,
      core
    }
    switch (panel) {
      case UIDatePickerPanels.MONTHS:
        return <UIDatePickerMonths {...panelProps} />
      case UIDatePickerPanels.YEARS:
        return <UIDatePickerYears {...panelProps} />
      default:
        return <UIDatePickerWeeks {...panelProps} />
    }
  }, [panel, props.value])
                                          
  return (
    <div className={`ui-datepicker ${className ?? ''}`}>
      <UIPopOver
        id={popOverId}
        template="primary"
        width={POPOVER_SIZE.WIDTH}
        height={POPOVER_SIZE.HEIGHT}
        anchor={iconButtonRef as React.MutableRefObject<HTMLDivElement>}
      >
        {currentPanel}
      </UIPopOver>
      <UITextField {...inputTextProps}
        id={`${popOverId}_textfield`}
        ref={inputRef}
        mask="{dd/dd/dddd}"
        icon={FaCalendarAlt}
        iconPosition='right'
        onKeyDown={onKeyDown}
        onMouseUp={onMouseUp}
        onClickIcon={open}
        iconContainerRef={iconButtonRef}
      />
    </div>
  );
};
                                          
export default UIDatePicker;