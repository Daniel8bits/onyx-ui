import { UIComboBoxProps } from "./UIComboBox"
import UIComboBoxCore from "./UIComboBoxCore"
import usePopOver from '@hooks/usePopOver'
import { useEffect, useRef } from "react"
import { FaCaretDown, FaTimes } from "react-icons/fa"
import UIPopOver from "@components/popover/UIPopOver"



interface UIComboBoxItemProps {
  value: string
  active: boolean
  onClick: (e: React.MouseEvent) => void
  className?: string
}

const UIComboBoxItem: React.FC<UIComboBoxItemProps> = (props) => {
  return (
    <button
      type='button'
      className={`${props.className ?? ''} ${props.active ? 'active' : ''}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};




export interface UIComboBoxTemplateProps extends UIComboBoxProps {
  core: UIComboBoxCore
  inputRef: ReactComponentRef<HTMLInputElement>
}

const UIComboBoxTemplate: React.FC<UIComboBoxTemplateProps> = (props) => {

  const popOverId = `${props.id}__popOver`
  const popover = usePopOver(popOverId)
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    props.core.onChange(() => {
      popover.close()
    })
    props.core.onBlur(() => {
      popover.close()
    })
  }, []);

  function getOptions(): JSX.Element {
    if (!props.core.dividedByCategories) {
      return (
        <div className='combobox-items'>
          {props.core.displayItems.map((item) => {
            return (
              <UIComboBoxItem
                key={item.value}
                value={item.label}
                active={item.value === props.value?.value}
                onClick={() => props.core.setValue(item)}
              />
            )
          })}
        </div>
      )
    }

    return (
      <div className='combobox-items'>
        {[...props.core.categories].map((collection) => (
          <div key={collection[0]}>
            <h5> {collection[0]} </h5>
            <div>
              {[...collection[1].values()].map((item) => {
                return (
                  <UIComboBoxItem
                    key={item.value}
                    value={item.label}
                    active={item.value === props.value?.value}
                    onClick={() => props.core.setValue(item)}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
  <div className={props.className}>
    {props.label &&
      <label htmlFor={props.id}>
        {props.label}
      </label>}
    <div ref={anchorRef} onClick={popover.open} className='combobox-input'>
      <input
        ref={props.inputRef}
        readOnly={!props.allowSearch}
        id={props.id}
        type="text"
        onKeyUp={props.core.search}
      />
      <input name={props.name ?? props.id} type="hidden" value={props.value?.value} />
      {!!props.allowNull && props.value &&
        <button type='button' onClick={props.core.clear}>
          <FaTimes />
        </button>}
      <div>
        <FaCaretDown />
      </div>
    </div>
    <UIPopOver
      id={popOverId}
      anchor={anchorRef}
      template="primary"
      width="anchor"
      height={props.core.height}
      position="bottom"
      scroll
    >
      {props.allowNull &&
        <UIComboBoxItem
          value=''
          active={props.value === null}
          onClick={() => props.core.setValue(null)}
        />}
      {getOptions()}
    </UIPopOver>
  </div>
)}

export default UIComboBoxTemplate