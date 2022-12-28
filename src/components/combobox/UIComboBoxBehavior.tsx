import useNew from "@hooks/useNew";
import { useEffect, useRef, useState } from "react";
import { UIComboBoxProps } from "./UIComboBox";
import UIComboBoxCore from "./UIComboBoxCore";
import { UIComboBoxTemplateProps } from "./UIComboBoxTemplate";


interface UIComboBoxBehaviorProps extends UIComboBoxProps {
  Template: React.FC<UIComboBoxTemplateProps>
}

const UIComboBoxBehavior: React.FC<UIComboBoxBehaviorProps> = (props) => {
  const {Template, className, ...templateProps} = props
  const [, setUpdater] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null)

  const core = useNew(UIComboBoxCore, [
    props.value,
    props.items,
    props.allowSearch,
    props.onAction,
    setUpdater
  ])

  useEffect(() => {
    core.setInput(inputRef.current)
  }, []);

  useEffect(() => {
    if(props.value !== core.value) {
      core.setValue(props.value)
    }
  }, [props.value]);

  useEffect(() => {
    core.setItems(props.items)
  }, [props.items]);

  useEffect(() => {
    core.setAllowSearch(props.allowSearch ?? false)
  }, [props.allowSearch]);

  const classes = `ui-combobox ${props.allowSearch ? 'allow-search' : ''} ${props.template ?? ''} ${className ?? ''}`

  return <Template core={core} inputRef={inputRef} className={classes} {...templateProps}  />
}

export default UIComboBoxBehavior