import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import usePopOver, { getPopOver } from '@hooks/usePopOver'
import UIPopOver from '@components/popover/UIPopOver'

import { FaCaretDown, FaTimes } from 'react-icons/fa'
import useNew from '@hooks/useNew';
import { IUseComponentHookReturn } from '@store/store';
import UIComboBoxCore, { UIComboItemData, UIComboItemType } from './UIComboBoxCore';


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

interface UIComboBoxProps {
  id: string
  name?: string
  template?: string
  items: UIComboItemType
  value: Nullable<UIComboItemData>
  onAction: StateSetter<Nullable<UIComboItemData>>
  label?: string
  allowNull?: boolean
  allowSearch?: boolean
}

const UIComboBox: React.FC<UIComboBoxProps> = (props) => {
  const [, setUpdater] = useState<boolean>(false);
  const popOverId = `${props.id}__popOver`
  const popover = usePopOver(popOverId)
  const anchorRef = useRef<HTMLDivElement>(null)
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
    core.onChange(() => {
      popover.close()
    })
    core.onBlur(() => {
      popover.close()
    })
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

  function getOptions(): JSX.Element {
    if (!core.dividedByCategories) {
      return (
        <div className='combobox-items'>
          {core.displayItems.map((item) => {
            return (
              <UIComboBoxItem
                key={item.value}
                value={item.label}
                active={item.value === props.value?.value}
                onClick={() => core.setValue(item)}
              />
            )
          })}
        </div>
      )
    }

    return (
      <div className='combobox-items'>
        {[...core.categories].map((collection) => (
          <div key={collection[0]}>
            <h5> {collection[0]} </h5>
            <div>
              {[...collection[1].values()].map((item) => {
                return (
                  <UIComboBoxItem
                    key={item.value}
                    value={item.label}
                    active={item.value === props.value?.value}
                    onClick={() => core.setValue(item)}
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
    <div className={`ui-combobox ${props.allowSearch ? 'allow-search' : ''} ${props.template ?? ''}`}>
      {props.label &&
        <label htmlFor={props.id}>
          {props.label}
        </label>}
      <div ref={anchorRef} onClick={popover.open} className='combobox-input'>
        <input
          ref={inputRef}
          readOnly={!props.allowSearch}
          id={props.id}
          type="text"
          onKeyUp={core.search}
        />
        <input name={props.name ?? props.id} type="hidden" value={props.value?.value} />
        {!!props.allowNull && props.value &&
          <button type='button' onClick={core.clear}>
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
        height={core.height}
        position="bottom"
        scroll
      >
        {props.allowNull &&
          <UIComboBoxItem
            value=''
            active={props.value === null}
            onClick={() => core.setValue(null)}
          />}
        {getOptions()}
      </UIPopOver>
    </div>
  );
};

export default UIComboBox;