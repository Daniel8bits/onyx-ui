/* eslint-disable react/prop-types */
import React from 'react';
import {usePopOverStore} from '@store/store';
import {useCallback, useEffect, useRef} from 'react';
import {type PopOverProps, type PopOverTemplateStyle} from './PopOverTemplate';
import type PopOverTemplate from './PopOverTemplate';
import {type PopOverTemplateProps} from './PopOverTemplate';
import {OnyxEvents} from '@internals/EventManager';
import {useRoot} from '@internals/Root';
import useClickOutside from '@hooks/useClickOutside';
import {type AquinoBehavior} from '@internals/ThemeManager';
import useComponentRef from '@hooks/useComponentRef';

const PopOverBehavior: AquinoBehavior<PopOverProps, typeof PopOverTemplate, PopOverTemplateStyle> = props => {
  const {Template, open, innerRef, ...templateProps} = props;

  // Cconst {data, create, destroy, close} = usePopOverStore();
  const data = usePopOverStore(state => state.data.filter(m => m[0] === props.id)[0]);
  const close = usePopOverStore(state => state.close);
  const create = usePopOverStore(state => state.create);
  const destroy = usePopOverStore(state => state.destroy);
    
  const currentOpenValue = ((): boolean => {
    if (props.id) {
      return (data ? data[1].open : false);
    }

    return open ?? false;
  })();

  const {ref, events, eventManager} = useComponentRef<HTMLDivElement>(innerRef);
  const [onClickOutside, removeClickOutside] = useClickOutside();

  useEffect(() => {
    if (props.id) {
      create({id: props.id, open: props.open ?? false});
      return () => {
        if (props.id) {
          destroy({id: props.id});
        }
      };
    }

    return undefined;
  }, []);

  const handleClose = useCallback(() => {
    if (props.id) {
      close({id: props.id});
    }
  }, []);

  useEffect(() => {
    if (props.id && currentOpenValue && ref.current) {
      removeClickOutside();
      onClickOutside(ref.current, handleClose);
    }
  }, [currentOpenValue]);

  const getWidth = useCallback((): number => {
    if (typeof props.width === 'string') {
      switch (props.width) {
        case 'inherit':
          return ref.current?.parentElement ? ref.current.parentElement.offsetWidth : 0;
        case 'anchor':
          return props.anchor.current 
            ? props.anchor.current.offsetWidth : 0;
        default:
          break;
      }
    }

    return props.width;        
  }, [props.width, props.anchor]);

  const getX = useCallback((): number => {
    if (!props.anchor.current) {
      return 0;
    }

    const gap = 32;
    const anchorX1 = props.anchor.current.offsetLeft;
    const anchorX2 = anchorX1 + props.anchor.current.offsetWidth;
    const popWidth = getWidth();
    if (props.position) {
      switch (props.position) {
        case 'top':
        case 'bottom':
          return anchorX1 + popWidth > window.innerWidth
            ? anchorX2 - popWidth
            : anchorX1;
        case 'left':
          return anchorX1 - popWidth - gap / 2;
        case 'right':
          return anchorX2 + gap / 2;
        default:
          break;
      }
    } else if (anchorX2 + gap + popWidth < window.innerWidth) {
      return anchorX2 + gap / 2;
    }

    return anchorX1 - gap / 2 - popWidth;
  }, [props.anchor, getWidth, props.position]);

  const getY = useCallback((): number => {
    if (!props.anchor.current) {
      return 0;
    }

    const gap = 8;
    const anchorY1 = props.anchor.current.offsetTop;
    const anchorY2 = anchorY1 + props.anchor.current.offsetHeight;
    const popHeight = props.height === 'auto' ? 0 : props.height;
    if (props.position) {
      switch (props.position) {
        case 'top':
          return anchorY1 - popHeight - gap;
        case 'bottom':
          return anchorY2 + gap;
        default:
          break;
      }
    }

    if (anchorY2 + popHeight < window.innerHeight) {
      return anchorY1;
    }

    return anchorY2 - popHeight;
  }, [props.anchor, props.height, props.position]);

  const rect = {
    x: getX(),
    y: getY(),
    width: getWidth(),
    height: props.height,
  };

  return <Template el={ref} events={events} rect={rect} open={currentOpenValue} {...templateProps} />;
};

export default PopOverBehavior;
