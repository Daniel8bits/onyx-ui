import template from '@internals/template';
import {type Theme} from '@internals/ThemeManager';
import React from 'react';

export interface ScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  verticalScrollWidth?: number;
  horizontalScrollHeight?: number;
  className?: string;
  children?: React.ReactNode;
}

export interface ScrollContainerTemplateProps extends ScrollContainerProps {
  verticalScrollRef: ReactElementRef<HTMLButtonElement>;
  horizontalScrollRef: ReactElementRef<HTMLButtonElement>;
  contentRef: ReactElementRef<HTMLDivElement>;
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
  doVerticalScroll: (e: React.MouseEvent) => void;
  doHorizontalScroll: (e: React.MouseEvent) => void;
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

export default template<
  ScrollContainerTemplateProps, 
  HTMLDivElement, 
  ScrollContainerTemplateStyle
>({
  name: 'scroll-container',
  jsx(props, data) {
    const {
      verticalScrollRef,
      horizontalScrollRef,
      contentRef,
      width,
      height,
      doVerticalScroll,
      doHorizontalScroll,
      verticalScrollWidth,
      horizontalScrollHeight,
      className,
      style: divStyle,
      containerWidth,
      containerHeight,
      children,
      events,
      el,
      ...divProps
    } = props;

    const {theme, dataAquino} = data;

    const vsw = verticalScrollWidth ?? 16;
    const hsh = horizontalScrollHeight ?? 16;

    const verticalScrollShouldBeVisible = height > 0;
    const horizontalScrollShouldBeVisible = width > 0;

    const mw = containerWidth - (verticalScrollShouldBeVisible ? vsw : 0);
    const mh = containerHeight - (horizontalScrollShouldBeVisible ? hsh : 0);

    return (
      <div 
        data-aquino={dataAquino}
        ref={el} 
        className={`${theme?.container[0] ?? ''} ${className ?? ''}`}
        style={{
          ...divStyle, 
          maxWidth: `${mw}px`,
          maxHeight: `${mh}px`,
          width: `${mw}px`,
          height: `${mh}px`,
          overflow: 'hidden',
        }}
        {...divProps}
        {...events}
      >
        <div ref={contentRef} className={theme?.container[1].content} style={{display: 'inline-block'}}>
          {children}
        </div>
        <div 
          className={theme?.container[1].controller[0]} 
          style={{
            width: `${mw}px`,
            height: `${mh}px`,
            top: el.current ? `${el.current.offsetTop}px` : 0,
            position: 'absolute',
            pointerEvents: 'none',
            backgroundColor: 'transparent',
          }}
        >
          {verticalScrollShouldBeVisible 
          && <div 
            className={theme?.container[1].controller[1].vertical[0]} 
            style={{
              position: 'absolute',
              pointerEvents: 'all',
              width: `${vsw}px`,
              height: `calc(100% - ${hsh}px)`,
              left: `${mw}px`,
            }}
            role='vertical scroll bar'
          >
            <button 
              ref={verticalScrollRef} 
              type='button' 
              onMouseDown={doVerticalScroll}
              className={theme?.container[1].controller[1].vertical[1].scroll} 
              style={{
                position: 'relative',
                width: '100%',
                height,
                cursor: 'pointer',
              }}
              role='vertical scroll button'
            />
          </div>}
          {horizontalScrollShouldBeVisible
          && <div 
            className={theme?.container[1].controller[1].horizontal[0]} 
            style={{
              position: 'absolute',
              pointerEvents: 'all',
              width: `calc(100% - ${vsw}px)`,
              height: `${hsh}px`,
              top: `${mh}px`,
            }}
            role='horizontal scroll bar'
          >
            <button 
              ref={horizontalScrollRef} 
              type='button' 
              onMouseDown={doHorizontalScroll}
              className={theme?.container[1].controller[1].horizontal[1].scroll} 
              style={{
                position: 'relative',
                width,
                height: '100%',
                cursor: 'pointer',
              }}
              role='horizontal scroll button'
            />
          </div>}
        </div>
      </div>
    );
  }, 
  theme: initialStyleValue,
});
