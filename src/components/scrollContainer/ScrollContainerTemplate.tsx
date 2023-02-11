import React from 'react';
import {type ScrollContainerProps} from './ScrollContainer';

export interface ScrollContainerTemplateProps extends ScrollContainerProps {
  verticalScrollRef: ReactElementRef<HTMLButtonElement>;
  horizontalScrollRef: ReactElementRef<HTMLButtonElement>;
  containerRef: ReactElementRef<HTMLDivElement>;
  contentRef: ReactElementRef<HTMLDivElement>;
  width: number;
  height: number;
  doVerticalScroll: (e: React.MouseEvent) => void;
}

const ScrollContainerTemplate: React.FC<ScrollContainerTemplateProps> = props => {
  const {
    verticalScrollRef,
    horizontalScrollRef,
    containerRef,
    contentRef,
    width,
    height,
    doVerticalScroll,
    className,
    style,
    maxHeight,
    children,
    ...divProps
  } = props;

  return (
    <div 
      ref={containerRef} 
      className={`ui-scroll-container ${className ?? ''}`}
      style={{...style, maxHeight: maxHeight ? `${maxHeight}px` : '100vh'}}
      {...divProps}
    >
      <div ref={contentRef} className='content'>
        {children}
      </div>
      <div 
        className='controller' 
        style={{
          height: containerRef.current ? `${containerRef.current.offsetHeight}px` : 0,
          top: containerRef.current ? `${containerRef.current.offsetTop}px` : 0,
        }}
      >
        {height > 0 && <div className='vertical'>
          <button 
            ref={verticalScrollRef} 
            type='button' 
            style={{height}}
            onMouseDown={doVerticalScroll}
          />
        </div>}
        {width > 0 && <div className='horizontal'>
          <button ref={horizontalScrollRef} type='button' style={{width}} />
        </div>}
      </div>
    </div>
  );
};

export default ScrollContainerTemplate;
