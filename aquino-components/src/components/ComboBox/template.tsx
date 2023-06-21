import React, {useEffect, useRef} from 'react';
import type ComboBoxCore from './common/ComboBoxCore';
import usePopOver from '@hooks/usePopOver';
import {FaCaretDown, FaTimes} from 'react-icons/fa';
import PopOver from '@components/PopOver';
import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import {type ComboItemData, type ComboItemType} from './common/ComboBoxCore';
import {type AllEventsAsObject} from '@internals/EventManager';

interface ComboBoxItemProps {
  value: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  height: number;
}

const ComboBoxItem: React.FC<ComboBoxItemProps> = props => (
  <button
    type='button'
    className={`${props.className ?? ''} ${props.active ? 'active' : ''}`}
    onClick={props.onClick}
    style={{height: props.height, width: '100%'}}
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
  inputEvents: Partial<AllEventsAsObject>;
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

export default template<
  ComboBoxTemplateProps, 
  HTMLInputElement, 
  ComboBoxTemplateStyle
>({
  name: 'combo-box',
  jsx(props, data) {
    const {theme, dataAquino} = data;
    const popOverId = `${props.id}__popover`;
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
      if (!props.core.getDividedByCategories()) {
        return (
          <div className={theme?.div[1].popover[1].nonCategorized[0]}>
            {props.core.getDisplayItems().map(item => (
                <ComboBoxItem
                  key={item.value}
                  value={item.label}
                  active={item.value === props.value?.value}
                  onClick={() => props.core.setValue(item)}
                  className={`${theme?.div[1].popover[1].item ?? ''} ${theme?.div[1].popover[1].nonCategorized[1].item ?? ''}`}
                  height={props.core.getItemHeight()}
                />
              ))}
          </div>
        );
      }
  
      return (
        <div data-aquino={dataAquino} className={theme?.div[1].popover[1].categorized[0]}>
          {[...props.core.getCategories()].map(collection => (
            <div key={collection[0]} className={theme?.div[1].popover[1].categorized[1].div[0]}>
              <h5 className={theme?.div[1].popover[1].categorized[1].div[1].h5}> {collection[0]} </h5>
              <div className={theme?.div[1].popover[1].categorized[1].div[1].div[0]}>
                {[...collection[1].values()].map(item => (
                    <ComboBoxItem
                      key={item.value}
                      value={item.label}
                      active={item.value === props.value?.value}
                      onClick={() => props.core.setValue(item)}
                      className={theme?.div[1].popover[1].categorized[1].div[1].div[1].item}
                      height={props.core.getItemHeight()}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  
    return (
      <div className={`${theme?.div[0] ?? ''} ${props.className ?? ''}`}>
        {props.label
          && <label htmlFor={props.id} className={theme?.div[1].label}>
            {props.label}
          </label>}
        <div ref={anchorRef} onClick={popover.open} className={theme?.div[1].div[0]}>
          <input
            ref={props.el}
            readOnly={!props.allowSearch}
            id={props.id}
            type='text'
            className={theme?.div[1].div[1].input}
            {...props.inputEvents}
          />
          <input name={props.name ?? props.id} type='hidden' value={props.value?.value} />
          {Boolean(props.allowNull) && props.value
            && <button type='button' onClick={props.core.clear} className={theme?.div[1].div[1].button[0]}>
              <FaTimes className={theme?.div[1].div[1].button[1].icon} />
            </button>}
          <div className={theme?.div[1].div[1].div[0]}>
            <FaCaretDown className={theme?.div[1].div[1].div[1].icon} />
          </div>
        </div>
        <PopOver
          id={popOverId}
          anchor={anchorRef}
          width='anchor'
          height={props.core.getHeight()}
          position='bottom'
          scroll
          className={theme?.div[1].popover[0]}
        >
          {props.allowNull
            && <ComboBoxItem
              value=''
              active={props.value === null}
              onClick={() => props.core.setValue(null)}
              className={theme?.div[1].popover[1].item}
              height={props.core.getItemHeight()}
            />}
          {getOptions()}
        </PopOver>
      </div>
    );
  }, 
  theme: initialThemeValue,
  css: /* css */ `
    div {
      background-color: red;
    }
  `,
});
