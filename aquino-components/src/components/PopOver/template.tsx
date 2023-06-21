import React from 'react';
import ScrollContainer from '@components/ScrollContainer';
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

export default template<
  PopOverTemplateProps, 
  HTMLDivElement, 
  PopOverTemplateStyle
>({
  name: 'popover',
  jsx: (props, data) => (
    <div 
      data-aquino={data.dataAquino}
      ref={props.el}
      style={{
        position: 'absolute',
        left: `${props.rect.x}px`,
        top: `${props.rect.y}px`,
        width: `${props.rect.width}px`,
        height: props.rect.height === 'auto' ? props.rect.height : `${props.rect.height}px`,
        visibility: props.open ? 'visible' : 'hidden',
      }}
      className={`${data.theme?.div ?? ''} ${props.className ?? ''}`}
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
  ), 
  theme: initialStyleValue,
});
