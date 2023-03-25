import React, {useEffect, useRef} from 'react';
import type ComboBoxCore from './ComboBoxCore';
import usePopOver from '@hooks/usePopOver';
import {FaCaretDown, FaTimes} from 'react-icons/fa';
import PopOver from '@components/popover/PopOver';
import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import {type ComboItemData, type ComboItemType} from './ComboBoxCore';

interface ComboBoxItemProps {
  value: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

const ComboBoxItem: React.FC<ComboBoxItemProps> = props => (
  <button
    type='button'
    className={`${props.className ?? ''} ${props.active ? 'active' : ''}`}
    onClick={props.onClick}
  >
    {props.value}
  </button>
);

export interface ComboBoxProps {
  id: string;
  name?: string;
  template?: string;
  className?: string;
  items: ComboItemType;
  value: Nullable<ComboItemData>;
  onAction: StateSetter<Nullable<ComboItemData>>;
  label?: string;
  allowNull?: boolean;
  allowSearch?: boolean;
}

export interface ComboBoxTemplateProps extends ComboBoxProps {
  core: ComboBoxCore;
}

const initialThemeValue = {
	div: ['', {
		label: '',
		div: ['', {
			input: '',
			button: ['', {
				icon: '',
			}],
			div: ['', {
				icon: '',
			}],
		}],
		popover: ['', {
			item: '',
			nonCategorized: ['', {
				item: '',
			}],
			categorized: ['', {
				div: ['', {
					h5: '',
					div: ['', {
						item: '',
					}],
				}],
			}],
		}],
	}],
} satisfies Theme;

export type ComboBoxTemplateStyle = typeof initialThemeValue;

const ComboBoxTemplate = template<ComboBoxTemplateProps, HTMLInputElement, ComboBoxTemplateStyle>((props, style) => {
  const popOverId = `${props.id}__popOver`;
  const popover = usePopOver(popOverId);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.core.onChange(() => {
      popover.close();
    });
    props.core.onBlur(() => {
      popover.close();
    });
  }, []);

  function getOptions(): JSX.Element {
    if (!props.core.dividedByCategories) {
      return (
        <div className={style?.div[1].popover[1].nonCategorized[0]}>
          {props.core.displayItems.map(item => (
              <ComboBoxItem
                key={item.value}
                value={item.label}
                active={item.value === props.value?.value}
                onClick={() => props.core.setValue(item)}
                className={`${style?.div[1].popover[1].item ?? ''} ${style?.div[1].popover[1].nonCategorized[1].item ?? ''}`}
              />
            ))}
        </div>
      );
    }

    return (
      <div className={style?.div[1].popover[1].categorized[0]}>
        {[...props.core.categories].map(collection => (
          <div key={collection[0]} className={style?.div[1].popover[1].categorized[1].div[0]}>
            <h5 className={style?.div[1].popover[1].categorized[1].div[1].h5}> {collection[0]} </h5>
            <div className={style?.div[1].popover[1].categorized[1].div[1].div[0]}>
              {[...collection[1].values()].map(item => (
                  <ComboBoxItem
                    key={item.value}
                    value={item.label}
                    active={item.value === props.value?.value}
                    onClick={() => props.core.setValue(item)}
                    className={style?.div[1].popover[1].categorized[1].div[1].div[1].item}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${style?.div[0] ?? ''} ${props.className ?? ''}`}>
      {props.label
        && <label htmlFor={props.id} className={style?.div[1].label}>
          {props.label}
        </label>}
      <div ref={anchorRef} onClick={popover.open} className={style?.div[1].div[0]}>
        <input
          ref={props.el}
          readOnly={!props.allowSearch}
          id={props.id}
          type='text'
          onKeyUp={props.core.search}
          className={style?.div[1].div[1].input}
        />
        <input name={props.name ?? props.id} type='hidden' value={props.value?.value} />
        {Boolean(props.allowNull) && props.value
          && <button type='button' onClick={props.core.clear} className={style?.div[1].div[1].button[0]}>
            <FaTimes className={style?.div[1].div[1].button[1].icon} />
          </button>}
        <div className={style?.div[1].div[1].div[0]}>
          <FaCaretDown className={style?.div[1].div[1].div[1].icon} />
        </div>
      </div>
      <PopOver
        id={popOverId}
        anchor={anchorRef}
        template='primary'
        width='anchor'
        height={props.core.height}
        position='bottom'
        scroll
        className={style?.div[1].popover[0]}
      >
        {props.allowNull
          && <ComboBoxItem
            value=''
            active={props.value === null}
            onClick={() => props.core.setValue(null)}
            className={style?.div[1].popover[1].item}
          />}
        {getOptions()}
      </PopOver>
    </div>
  );
}, initialThemeValue);

export default ComboBoxTemplate;
