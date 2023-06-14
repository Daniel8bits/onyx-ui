import React from 'react';
import ScrollContainer from '@components/scrollContainer/ScrollContainer';
import {type Theme} from '@internals/ThemeManager';
import template from '@internals/template';

export interface PopOverProps {
  readonly id?: string;
  width: number | 'inherit' | 'anchor';
  height: number | 'auto';
  anchor: ReactElementRef;
  open?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  scroll?: boolean;
  template?: string;
  className?: string;
  children?: any;
}

export interface PopOverTemplateProps extends PopOverProps {
  rect: {
    x: number;
    y: number;
    width: number;
    height: number | 'auto';
  };
}

const initialStyleValue = {
	div: '',
} satisfies Theme;

export type PopOverTemplateStyle = typeof initialStyleValue;

const PopOverTemplate = template<PopOverTemplateProps, HTMLDivElement, PopOverTemplateStyle>((props, style) => (
  <div 
    ref={props.el}
    style={{
      position: 'absolute',
      left: `${props.rect.x}px`,
      top: `${props.rect.y}px`,
      width: `${props.rect.width}px`,
      height: props.rect.height === 'auto' ? props.rect.height : `${props.rect.height}px`,
      visibility: props.open ? 'visible' : 'hidden',
    }}
    className={`${style?.div ?? ''} ${props.className ?? ''}`}
  >
    {
      props.scroll && props.height !== 'auto' 
        ? (
          <ScrollContainer>
            {props.open && (
              <div role='popover' style={{width: '100%'}}>
                {props.children}
              </div>
            )}
          </ScrollContainer>
        )
        : props.open && (
          <div role='popover'>
            {props.children}
          </div>
        )
    }
  </div>
), initialStyleValue);
/*
{props.open && (
  props.scroll && props.height !== 'auto' 
  ? <ScrollContainer role='popover'>
    {props.children}
  </ScrollContainer>
  : <div role='popover'>
    {props.children}
  </div>
)}
*/
export default PopOverTemplate;
