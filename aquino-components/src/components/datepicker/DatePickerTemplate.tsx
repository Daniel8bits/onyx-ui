import React, {useEffect, useMemo, useRef, useState} from 'react';
import type DatePickerCore from './DatePickerCore';
import usePopOver from '@hooks/usePopOver';
import DatePickerMonths from './months/DatePickerMonths';
import DatePickerYears from './years/DatePickerYears';
import DatePickerWeeks from './weeks/DatePickerWeeks';
import PopOver from '@components/popover/PopOver';
import {FaCalendarAlt} from 'react-icons/fa';
import type ExtendedDate from './ExtendedDate';
import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import {type TextfieldProps} from '@components/textfield/TextfieldTemplate';
import useUniqueId from '@hooks/useUniqueId';
import MaskedTextfield from '@components/maskedTextfield/MaskedTextfield';
import {AquinoEvents} from '@internals/EventManager';
import useComponentRef from '@hooks/useComponentRef';

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
  updateValue: StateSetter<{value: (v?: string) => string}>;
}

const initialStyleValue = {
	div: ['', {
    popover: '',
    textfield: '',
  }],
} satisfies Theme;

export type DatePickerTemplateStyle = typeof initialStyleValue;

const fn = () => console.log('key up');

const DatePickerTemplate = template<DatePickerTemplateProps, HTMLDivElement, DatePickerTemplateStyle>((props, style) => {
  const popOverSize = {
    width: 270,
    height: 315,
  };

  const iconButtonRef = useRef<HTMLDivElement>(null);
  const uniqueId = useUniqueId(props.id, true);
  const popoverId = `${uniqueId()}__popover`;
  const {open} = usePopOver(popoverId);

  const [maskedTextfieldRef, setMaskedTextfieldRef] = useComponentRef<typeof MaskedTextfield>();

  const {
    onAction,
    onMouseUp,
    onKeyDown,
    value,
    className,
    core,
    el,
    updateValue,
    theme, 
    events,
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

  useEffect(() => {
    if (!maskedTextfieldRef) return;
    updateValue({value(value) {
      if (!maskedTextfieldRef) return '';
      if (value) {
        maskedTextfieldRef.masking.externalUpdate(value, 0);
      }

      return maskedTextfieldRef.el.value;
    }});
    maskedTextfieldRef.eventListeners.add(AquinoEvents.KEYUP, core.getInputKeyUpEvent());
  }, [maskedTextfieldRef]);

  return (
    <div ref={el} className={`${style?.div[0] ?? ''} ${props.className ?? ''}`} {...events}>
      <PopOver
        id={popoverId}
        width={popOverSize.width}
        height={popOverSize.height}
        anchor={iconButtonRef}
        className={style?.div[1].popover}
      >
        {currentPanel}
      </PopOver>
      <MaskedTextfield {...inputTextProps}
        id={`${uniqueId()}_textfield`}
        innerRef={setMaskedTextfieldRef}
        mask='{dddd}/{dd}/{dd}'
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
