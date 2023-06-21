import {useCallback, useEffect, useRef, useState} from 'react';
import {type ScrollContainerProps} from './template';
import type ScrollContainerTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import {AquinoEvents} from '@internals/EventManager';
import {useRoot} from '@internals/Root';
import useRootEventManager from '@hooks/useRootEventManager';
import {easeInAndOutLerp} from '@utils/cubicBezierLerp';
import behavior, {type B} from '@internals/behavior';

interface AnimationFlags {
  animating: boolean; 
  beginTime: number;
  endTime: number;
  beginPosition: number;
  endPosition: number;
  positiveDirection: boolean;
}

export const {Behavior, useBehavior} = behavior<
  ScrollContainerProps, 
  typeof ScrollContainerTemplate
>(props => {
  const {
    verticalScrollWidth,
    horizontalScrollHeight,
    innerRef, 
    ...templateProps
  } = props;

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const {root} = useRoot();
  const rootEventManager = useRootEventManager(root);
  
  const container = useCreateComponentRef<B<ScrollContainerProps, typeof ScrollContainerTemplate>>(innerRef);
  const contentRef = useRef<HTMLDivElement>(null);

  const verticalScrollRef = useRef<HTMLButtonElement>(null);
  const verticalButtonScrollEventRef = useRef<(e: React.MouseEvent) => void>();

  const horizontalScrollRef = useRef<HTMLButtonElement>(null);
  const horizontalButtonScrollEventRef = useRef<(e: React.MouseEvent) => void>();

  const scrollPositionRef = useRef<{x: number; y: number}>({x: 0, y: 0});
  const pagePositionRef = useRef<{x: number; y: number}>({x: 0, y: 0});
  
  const observerRef = useRef<ResizeObserver>();
  const parentObserverRef = useRef<ResizeObserver>();

  const verticalScrollAnimationFlagsRef = useRef<AnimationFlags>({
    animating: false, 
    beginTime: 0,
    endTime: 0,
    beginPosition: 0,
    endPosition: 0,
    positiveDirection: false,
  });

  const horizontalScrollAnimationFlagsRef = useRef<AnimationFlags>({
    animating: false, 
    beginTime: 0,
    endTime: 0,
    beginPosition: 0,
    endPosition: 0,
    positiveDirection: false,
  });

  const [containerWidth, setContainerWidth] = useState<number>(container.ref.current?.parentElement?.offsetWidth ?? window.innerWidth);
  const [containerHeight, setContainerHeight] = useState<number>(container.ref.current?.parentElement?.offsetHeight ?? window.innerHeight);

  const resetAnimationFlags = (animationFlags: AnimationFlags) => {
    animationFlags.beginTime = 0;
    animationFlags.endTime = 0;
    animationFlags.beginPosition = 0;
    animationFlags.endPosition = 0;
    animationFlags.animating = false;
    animationFlags.positiveDirection = false;
  };

  const updatePagePosition = () => {
    if (!contentRef.current) return;
    const {x, y} = pagePositionRef.current;
    contentRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const getGoalValue = (
    movement: number,
    currentValue: number,
    containerSize: number,
    scrollSize: number,
  ): number => {
    const minScrollPosition = 0;
    const maxScrollPosition = containerSize - scrollSize;
    
    const newValue = currentValue + movement; 
    let goalValue = currentValue;
    
    if (movement < 0 && currentValue !== minScrollPosition) {
      if (newValue < minScrollPosition) {
        goalValue = minScrollPosition;
      } else {
        goalValue = newValue;
      }
    } else if (movement > 0 && currentValue !== maxScrollPosition) {
      if (newValue > maxScrollPosition) {
        goalValue = maxScrollPosition;
      } else {
        goalValue = newValue;
      }
    }

    return goalValue;
  };

  const updateVerticalScroll = useCallback((movementY: number) => {
    if (!verticalScrollRef.current) return;
    if (!container.ref.current) return;
    if (!contentRef.current) return;

    console.log(movementY);

    const goalValue = getGoalValue(
      movementY,
      scrollPositionRef.current.y,
      container.ref.current.offsetHeight,
      verticalScrollRef.current.offsetHeight,
    );

    scrollPositionRef.current.y = goalValue;
    verticalScrollRef.current.style.top = `${goalValue}px`;

    const absolute = container.ref.current.offsetHeight - height;
    const percentual = container.ref.current.offsetHeight - (height + goalValue);

    const contentHeight = contentRef.current.offsetHeight;
    pagePositionRef.current.y = -(contentHeight - (contentHeight * percentual / absolute));

    updatePagePosition();
  }, []);

  const updateHorizontalScroll = useCallback((movementX: number) => {
    if (!horizontalScrollRef.current) return;
    if (!container.ref.current) return;
    if (!contentRef.current) return;

    const goalValue = getGoalValue(
      movementX,
      scrollPositionRef.current.x,
      container.ref.current.offsetWidth,
      horizontalScrollRef.current.offsetWidth,
    );

    scrollPositionRef.current.x = goalValue;
    horizontalScrollRef.current.style.left = `${goalValue}px`;

    const absolute = container.ref.current.offsetWidth - width;
    const percentual = container.ref.current.offsetWidth - (width + goalValue);

    const contentWidth = contentRef.current.offsetWidth;
    pagePositionRef.current.x = -(contentWidth - (contentWidth * percentual / absolute));

    updatePagePosition();
  }, []);

  const interpolateScroll = (
    size: number,
    containerSize: number,
    contentSize: number, 
    animationFlags: AnimationFlags,
  ) => {
    const currentTime = Date.now();

    const {beginTime, endTime, beginPosition, endPosition} = animationFlags;

    const isAnimationEnd = currentTime >= endTime;

    const absolutePositionAmount = endPosition - beginPosition;
    const absoluteTimeAmount = endTime - beginTime;
    const relativeTimeAmount = (isAnimationEnd ? endTime : currentTime) - beginTime;

    const T = relativeTimeAmount / absoluteTimeAmount;

    const factor = easeInAndOutLerp(T);
    
    const newPosition = beginPosition + absolutePositionAmount * factor;

    const absolute = containerSize - size;
    const percentual = containerSize - (size + newPosition);

    const pagePosition = -(contentSize - (contentSize * percentual / absolute));
    
    return {scrollPosition: newPosition, pagePosition, isAnimationEnd};
  };

  const interpolateVerticalScroll = () => {
    if (!contentRef.current) return;
    if (!container.ref.current) return;
    if (!verticalScrollRef.current) return;
    if (!verticalScrollAnimationFlagsRef.current.animating) return;

    const {scrollPosition, pagePosition, isAnimationEnd} = interpolateScroll(
      height,
      container.ref.current.offsetHeight, 
      contentRef.current.offsetHeight, 
      verticalScrollAnimationFlagsRef.current,
    );
    
    console.log(pagePosition);
    scrollPositionRef.current.y = scrollPosition;
    verticalScrollRef.current.style.top = `${scrollPosition}px`;
    pagePositionRef.current.y = pagePosition;

    updatePagePosition();

    if (isAnimationEnd) {
      resetAnimationFlags(verticalScrollAnimationFlagsRef.current);
      return;
    }

    requestAnimationFrame(interpolateVerticalScroll);
  };

  const interpolateHorizontalScroll = () => {
    if (!contentRef.current) return;
    if (!container.ref.current) return;
    if (!horizontalScrollRef.current) return;
    if (!horizontalScrollAnimationFlagsRef.current.animating) return;

    const {scrollPosition, pagePosition, isAnimationEnd} = interpolateScroll(
      width,
      container.ref.current.offsetWidth, 
      contentRef.current.offsetWidth, 
      horizontalScrollAnimationFlagsRef.current,
    );

    scrollPositionRef.current.x = scrollPosition;
    horizontalScrollRef.current.style.left = `${scrollPosition}px`;
    pagePositionRef.current.x = pagePosition;

    updatePagePosition();

    if (isAnimationEnd) {
      resetAnimationFlags(horizontalScrollAnimationFlagsRef.current);
      return;
    }

    requestAnimationFrame(interpolateHorizontalScroll);
  };

  const animateScroll = (
    movement: number, 
    animationFlags: AnimationFlags,
    scrollPosition: number,
    containerSize: number,
    scrollSize: number,
    lerp: () => void,
    // eslint-disable-next-line max-params
  ) => {
    if (movement === 0) return;

    const isPositive = movement >= 0;
    if (animationFlags.animating && animationFlags.positiveDirection !== isPositive) {
      animationFlags.animating = false;
      resetAnimationFlags(animationFlags);
    }

    animationFlags.positiveDirection = isPositive;
    animationFlags.beginPosition = scrollPosition;
    animationFlags.endPosition = getGoalValue(movement, scrollPosition, containerSize, scrollSize);
    const now = Date.now();
    animationFlags.endTime = now + 250;

    if (!animationFlags.animating) {
      animationFlags.animating = true;
      animationFlags.beginTime = now;
      lerp();
    }
  };

  const doVerticalScroll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (contentRef.current && container.ref.current) {
      if (verticalScrollRef.current) {
        verticalButtonScrollEventRef.current = e => updateVerticalScroll(e.movementY);
        rootEventManager.add(AquinoEvents.MOUSEMOVE, verticalButtonScrollEventRef.current);
      }
    }
  }, [rootEventManager]);

  const doHorizontalScroll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (contentRef.current && container.ref.current) {
      if (horizontalScrollRef.current) {
        horizontalButtonScrollEventRef.current = e => updateHorizontalScroll(e.movementX);
        rootEventManager.add(AquinoEvents.MOUSEMOVE, horizontalButtonScrollEventRef.current);
      }
    }
  }, [rootEventManager]);

  const updateScrollSizes = () => {
    if (!container.ref.current) return;
    if (!contentRef.current) return;

    const contentWidth = contentRef.current.offsetWidth;
    const containerWidth = container.ref.current.offsetWidth;
    const contentHeight = contentRef.current.offsetHeight;
    const containerHeight = container.ref.current.offsetHeight;
    
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
  };

  const updateContainerSizes = () => {
    setContainerWidth(container.ref.current?.parentElement?.offsetWidth ?? window.innerWidth);
    setContainerHeight(container.ref.current?.parentElement?.offsetHeight ?? window.innerHeight);
  };

  useEffect(() => {
    const scrollEvent = (e: React.WheelEvent) => e.shiftKey
      ? animateScroll(
        e.deltaY / 2, 
        horizontalScrollAnimationFlagsRef.current, 
        scrollPositionRef.current.x,
        container.ref.current?.offsetWidth ?? 0,
        horizontalScrollRef.current?.offsetWidth ?? 0,
        interpolateHorizontalScroll,
      )
      : animateScroll(
        e.deltaY / 2, 
        verticalScrollAnimationFlagsRef.current, 
        scrollPositionRef.current.y,
        container.ref.current?.offsetHeight ?? 0,
        verticalScrollRef.current?.offsetHeight ?? 0,
        interpolateVerticalScroll,
      );

    if (contentRef.current && container.ref.current && container.ref.current.parentElement) {
      const observer = new ResizeObserver(updateScrollSizes);
      observer.observe(container.ref.current);
      observer.observe(contentRef.current);
      observerRef.current = observer;
      
      const parentObserver = new ResizeObserver(updateContainerSizes);
      parentObserver.observe(container.ref.current.parentElement);
      parentObserverRef.current = parentObserver;

      container.eventManager.add(0, AquinoEvents.WHEEL, scrollEvent);
      updateScrollSizes();
    }

    const mouseUpEvent = () => {
      if (verticalScrollRef.current && verticalButtonScrollEventRef.current) {
        rootEventManager.remove(AquinoEvents.MOUSEMOVE, verticalButtonScrollEventRef.current);
        verticalButtonScrollEventRef.current = undefined;
      }

      if (horizontalScrollRef.current && horizontalButtonScrollEventRef.current) {
        rootEventManager.remove(AquinoEvents.MOUSEMOVE, horizontalButtonScrollEventRef.current);
        horizontalButtonScrollEventRef.current = undefined;
      }
    };

    rootEventManager.add(AquinoEvents.MOUSEUP, mouseUpEvent);

    return () => {
      rootEventManager.remove(AquinoEvents.MOUSEUP, mouseUpEvent);
      container.eventManager.add(0, AquinoEvents.WHEEL, scrollEvent);
    };
  }, [rootEventManager]);

  return {
    width,
    height,
    containerWidth,
    containerHeight,
    el: container.ref,
    contentRef,
    verticalScrollRef,
    horizontalScrollRef,
    doVerticalScroll,
    doHorizontalScroll,
    events: container.events,
    ...templateProps,
  };
});

export default Behavior;
