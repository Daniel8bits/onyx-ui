import React, {useMemo, useRef, useState} from 'react';
import type DatePickerCore from './DatePickerCore';
import usePopOver from '@hooks/usePopOver';
import DatePickerMonths from './months/DatePickerMonths';
import DatePickerYears from './years/DatePickerYears';
import DatePickerWeeks from './weeks/DatePickerWeeks';
import PopOver from '@components/popover/PopOver';
import Textfield, {type TextfieldProps} from '@components/textfield/Textfield';
import {FaCalendarAlt} from 'react-icons/fa';
import type ExtendedDate from './ExtendedDate';
import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';

export interface DatePickerProps extends Override<TextfieldProps, {
  value: Nullable<ExtendedDate>;
  onAction: StateSetter<Nullable<ExtendedDate>>;
}> {
}

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
}

const initialStyleValue = {
	div: ['', {
    popover: '',
    textfield: '',
  }],
} satisfies Theme;

export type DatePickerTemplateStyle = typeof initialStyleValue;

const DatePickerTemplate = template<DatePickerTemplateProps, HTMLInputElement, DatePickerTemplateStyle>((props, style) => {
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
    el,
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
    <div className={`${style?.div[0] ?? ''} ${props.className ?? ''}`}>
      <PopOver
        id={popoverId}
        template='primary'
        width={popOverSize.width}
        height={popOverSize.height}
        anchor={iconButtonRef}
        className={style?.div[1].popover}
      >
        {currentPanel}
      </PopOver>
      <Textfield {...inputTextProps}
        id={`${id}_textfield`}
        innerRef={el}
        mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/]}
        icon={FaCalendarAlt}
        iconPosition='right'
        onKeyDown={onKeyDown}
        onMouseUp={onMouseUp}
        onClickIcon={open}
        iconContainerRef={iconButtonRef}
        className={style?.div[1].textfield}
      />
    </div>
  );
}, initialStyleValue);

export default DatePickerTemplate;
