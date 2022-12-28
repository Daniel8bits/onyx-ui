import React, { useMemo, useRef, useState } from "react"
import { UIDatePickerProps } from "./UIDatePicker"
import UIDatePickerCore from "./UIDatePickerCore"
import usePopOver from '@hooks/usePopOver'
import UIDatePickerMonths from "./months/UIDatePickerMonths"
import UIDatePickerYears from "./years/UIDatePickerYears"
import UIDatePickerWeeks from "./weeks/UIDatePickerWeeks"
import UIPopOver from "@components/popover/UIPopOver"
import UITextfield from "@components/textfield/UITextfield"
import { FaCalendarAlt } from "react-icons/fa"

export enum UIDatePickerPanels {
  WEEKS = 0,
  MONTHS = 1,
  YEARS = 2
}
    
export interface UIDatePickerPanelProps {
  setPanel: (panel: UIDatePickerPanels) => void
  core: UIDatePickerCore
}

export interface UIDatePickerTemplateProps extends UIDatePickerProps {
  core: UIDatePickerCore
  inputRef: ReactComponentRef<HTMLInputElement>
}

const UIDatePickerTemplate: React.FC<UIDatePickerTemplateProps> = (props) => {

  const POPOVER_SIZE = {
    WIDTH: 270, 
    HEIGHT: 315
  }

  const iconButtonRef = useRef<HTMLDivElement>(null)

  const id = props.id.trim()
  const popoverId = `${id}__popover`
  const {open} = usePopOver(popoverId)

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

  const [panel, setPanel] = useState<UIDatePickerPanels>(UIDatePickerPanels.WEEKS)

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
        id={popoverId}
        template="primary"
        width={POPOVER_SIZE.WIDTH}
        height={POPOVER_SIZE.HEIGHT}
        anchor={iconButtonRef as React.MutableRefObject<HTMLDivElement>}
      >
        {currentPanel}
      </UIPopOver>
      <UITextfield {...inputTextProps}
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
}

export default UIDatePickerTemplate