import React, {useMemo, useRef, useState} from 'react';
import {type DatePickerProps} from './DatePicker';
import type DatePickerCore from './DatePickerCore';
import usePopOver from '@hooks/usePopOver';
import DatePickerMonths from './months/DatePickerMonths';
import DatePickerYears from './years/DatePickerYears';
import DatePickerWeeks from './weeks/DatePickerWeeks';
import PopOver from '@components/popover/PopOver';
import Textfield from '@components/textfield/Textfield';
import {FaCalendarAlt} from 'react-icons/fa';

export enum DatePickerPanels {
  WEEKS = 0,
  MONTHS = 1,
  YEARS = 2,
}

export interface DatePickerPanelProps {
  setPanel: (panel: DatePickerPanels) => void;
  core: DatePickerCore;
}

export interface DatePickerTemplateProps extends DatePickerProps {
  core: DatePickerCore;
  inputRef: ReactComponentRef<HTMLInputElement>;
}

const DatePickerTemplate: React.FC<DatePickerTemplateProps> = props => {
  const popOverSize = {
    width: 270,
    height: 315,
  };

  const iconButtonRef = useRef<HTMLDivElement>(null);

  const id = props.id.trim();
  const popoverId = `${id}__popover`;
  const {open} = usePopOver(popoverId);

  const {
    onAction,
    onMouseUp,
    onKeyDown,
    value,
    mask,
    className,
    core,
    inputRef,
    ...inputTextProps
  } = props;

  const [panel, setPanel] = useState<DatePickerPanels>(DatePickerPanels.WEEKS);

  const currentPanel = useMemo<JSX.Element>(() => {
    const panelProps = {
      value: props.value,
      ratio: popOverSize.width,
      setPanel,
      setDate: onAction,
      core,
    };
    switch (panel) {
      case DatePickerPanels.MONTHS:
        return <DatePickerMonths {...panelProps} />;
      case DatePickerPanels.YEARS:
        return <DatePickerYears {...panelProps} />;
      default:
        return <DatePickerWeeks {...panelProps} />;
    }
  }, [panel, props.value]);

  return (
    <div className={`ui-datepicker ${className ?? ''}`}>
      <PopOver
        id={popoverId}
        template='primary'
        width={popOverSize.width}
        height={popOverSize.height}
        anchor={iconButtonRef as React.MutableRefObject<HTMLDivElement>}
      >
        {currentPanel}
      </PopOver>
      <Textfield {...inputTextProps}
        id={`${id}_textfield`}
        ref={inputRef}
        mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
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

export default DatePickerTemplate;
