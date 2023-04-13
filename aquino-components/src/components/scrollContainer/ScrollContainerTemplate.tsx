import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import React from 'react';

export interface ScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number;
  className?: string;
  children?: React.ReactNode;
}

export interface ScrollContainerTemplateProps extends ScrollContainerProps {
  verticalScrollRef: ReactElementRef<HTMLButtonElement>;
  horizontalScrollRef: ReactElementRef<HTMLButtonElement>;
  contentRef: ReactElementRef<HTMLDivElement>;
  width: number;
  height: number;
  doVerticalScroll: (e: React.MouseEvent) => void;
}

const initialStyleValue = {
	container: ['', {
    content: '',
    controller: ['', {
      vertical: ['', {
        scroll: '',
      }],
      horizontal: ['', {
        scroll: '',
      }],
    }],
  }],
} satisfies Theme;

export type ScrollContainerTemplateStyle = typeof initialStyleValue;

const ScrollContainerTemplate = template<ScrollContainerTemplateProps, HTMLDivElement, ScrollContainerTemplateStyle>((props, style) => {
  const {
    verticalScrollRef,
    horizontalScrollRef,
    contentRef,
    width,
    height,
    doVerticalScroll,
    className,
    style: divStyle,
    maxHeight,
    children,
    events,
    el,
    ...divProps
  } = props;

  const scrollSize = '5rem';

  return (
    <div 
      ref={el} 
      className={`${style?.container[0] ?? ''} ${className ?? ''}`}
      style={{
        ...divStyle, 
        maxHeight: maxHeight ? `${maxHeight}px` : '100vh',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
      {...divProps}
      {...events}
    >
      <div ref={contentRef} className={style?.container[1].content}>
        {children}
      </div>
      <div 
        className={style?.container[1].controller[0]} 
        style={{
          width: el.current ? `${el.current.offsetWidth}px` : '100%',
          height: el.current ? `${el.current.offsetHeight}px` : '100%',
          top: el.current ? `${el.current.offsetTop}px` : 0,
          position: 'absolute',
          pointerEvents: 'none',
        }}
      >
        {height > 0 
        && <div 
          className={style?.container[1].controller[1].vertical[0]} 
          style={{
            position: 'absolute',
            pointerEvents: 'all',
            width: scrollSize,
            height: '100%',
            left: `calc(100% - ${scrollSize})`,
          }}
        >
          <button 
            ref={verticalScrollRef} 
            type='button' 
            onMouseDown={doVerticalScroll}
            className={style?.container[1].controller[1].vertical[1].scroll} 
            style={{
              position: 'relative',
              width: '100%',
              height,
              cursor: 'pointer',
            }}
          />
        </div>}
        {width > 0 
        && <div 
          className={style?.container[1].controller[1].horizontal[0]} 
          style={{
            position: 'absolute',
            pointerEvents: 'all',
            width: '100%',
            height: scrollSize,
            top: `calc(100% - ${scrollSize})`,
          }}
        >
          <button 
            ref={horizontalScrollRef} 
            type='button' 
            className={style?.container[1].controller[1].horizontal[1].scroll} 
            style={{
              position: 'relative',
              width,
              height: '100%',
              cursor: 'pointer',
            }}
          />
        </div>}
      </div>
    </div>
  );
}, initialStyleValue);

export default ScrollContainerTemplate;
