/* eslint-disable react/prop-types */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {type AquinoBehavior} from '@internals/ThemeManager';
import {type ScrollContainerProps} from './ScrollContainerTemplate';
import type ScrollContainerTemplate from './ScrollContainerTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';

const ScrollContainerBehavior: AquinoBehavior<ScrollContainerProps, typeof ScrollContainerTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const {ref: containerRef, events} = useCreateComponentRef<typeof ScrollContainerBehavior>(innerRef);

  const contentRef = useRef<HTMLDivElement>(null);
  const verticalScrollRef = useRef<HTMLButtonElement>(null);
  const horizontalScrollRef = useRef<HTMLButtonElement>(null);
  const verticalScrollPositionRef = useRef<number>(0);
  const horizontalScrollPositionRef = useRef<number>(0);
  const buttonScrollEventRef = useRef<(e: MouseEvent) => void>();
  
  const observerRef = useRef<ResizeObserver>();

  useEffect(() => {
    const scrollEvent = (e: WheelEvent) => updateVerticalScroll(e.deltaY);
    if (contentRef.current && containerRef.current) {
      const observer = new ResizeObserver(() => {
        if (!containerRef.current) {
          return;
        }

        if (!contentRef.current) {
          return;
        }

        const contentWidth = contentRef.current.offsetWidth;
        const containerWidth = containerRef.current.offsetWidth;
        const contentHeight = contentRef.current.offsetHeight;
        const containerHeight = containerRef.current.offsetHeight;
        if (contentHeight <= containerHeight) {
          setHeight(0);
        } else {
          setHeight(containerHeight ** 2 / contentHeight);
        }

        if (contentWidth <= containerWidth) {
          setWidth(0);
        } else {
          setWidth(containerWidth ** 2 / contentWidth);
        }
      });
      observer.observe(containerRef.current);
      observer.observe(contentRef.current);
      observerRef.current = observer;
      containerRef.current.addEventListener('wheel', scrollEvent);
    }

    const mouseUpEvent = () => {
      if (verticalScrollRef.current && buttonScrollEventRef.current) {
        document.body.removeEventListener('mousemove', buttonScrollEventRef.current);
        buttonScrollEventRef.current = undefined;
      }
    };

    document.body.addEventListener('mouseup', mouseUpEvent);

    const containerDiv = containerRef.current;

    return () => {
      if (!containerDiv) return;

      document.body.removeEventListener('mouseup', mouseUpEvent);
      containerDiv.addEventListener('wheel', scrollEvent);
    };
  }, []);

  const updateVerticalScroll = useCallback((movementY: number) => {
    if (!verticalScrollRef.current) return;

    if (!containerRef.current) return;

    if (!contentRef.current) return;

    const minScrollPosition = 0;
    const maxScrollPosition = containerRef.current.offsetHeight - verticalScrollRef.current.offsetHeight;
    const newValue = verticalScrollPositionRef.current + movementY;
    
    if (movementY < 0 && verticalScrollPositionRef.current !== minScrollPosition) {
      if (newValue < minScrollPosition) {
        verticalScrollPositionRef.current = minScrollPosition;
      } else {
        verticalScrollPositionRef.current = newValue;
      }
    } else if (movementY > 0 && verticalScrollPositionRef.current !== maxScrollPosition) {
      if (newValue > maxScrollPosition) {
        verticalScrollPositionRef.current = maxScrollPosition;
      } else {
        verticalScrollPositionRef.current = newValue;
      }
    }

    verticalScrollRef.current.style.top = `${verticalScrollPositionRef.current}px`;

    const absolute = containerRef.current.offsetHeight - height;
    const percentual = containerRef.current.offsetHeight - (height + verticalScrollPositionRef.current);

    const contentHeight = contentRef.current.offsetHeight;
    const pagePosition = contentHeight - (contentHeight * percentual / absolute);

    contentRef.current.style.transform = `translateY(${-pagePosition}px)`;
  }, []);

  const doVerticalScroll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (contentRef.current && containerRef.current) {
      if (verticalScrollRef.current) {
        buttonScrollEventRef.current = e => updateVerticalScroll(e.movementY);
        document.body.addEventListener('mousemove', buttonScrollEventRef.current);
      }
    }
  }, []);

  return (
    <Template  
      width={width}
      height={height}
      el={containerRef}
      contentRef={contentRef}
      verticalScrollRef={verticalScrollRef}
      horizontalScrollRef={horizontalScrollRef}
      doVerticalScroll={doVerticalScroll}
      events={events}
      {...templateProps}
    />
  );
};

export default ScrollContainerBehavior;
