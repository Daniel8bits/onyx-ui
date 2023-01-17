import React from 'react';
import {usePopOverStore} from '@store/store';
import onClickOutside, {type OnClickOutsideCallback, type OnClickOutsideCallbackRefObject} from '@utils/onClickOutside';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import {type PopOverProps} from './PopOver';
import {type PopOverTemplateProps} from './PopOverTemplate';

interface PopOverBehaviorProps extends PopOverProps {
  Template: React.FC<PopOverTemplateProps>;
}

const PopOverBehavior: React.FC<PopOverBehaviorProps> = props => {
  const {Template, ...templateProps} = props;

  const {data, create, destroy, close} = usePopOverStore();
    
  const currentOpenValue = ((): boolean => {
    if (props.id) {
      const popover = data.filter(m => m[0] === props.id)[0];
      return (popover ? popover[1].open : false);
    }

    return props.open ?? false;
  })();

  const popoverRef = useRef<HTMLDivElement>(null);
  const event = useRef<OnClickOutsideCallback>(null);

  useEffect(() => {
    if (props.id) {
      create(props.id, props.open ?? false);
      return () => {
        if (props.id) {
destroy(props.id);
}
      };
    }

    return undefined;
  }, []);

  const handleClose = useCallback(() => {
    if (props.id) {
close(props.id);
}
  }, []);

  useEffect(() => {
    if (props.id && currentOpenValue && popoverRef.current) {
      const e = event as OnClickOutsideCallbackRefObject;

      if (event.current) {
        document.removeEventListener('click', event.current, true);
        e.current = null;
      }

      e.current = onClickOutside(popoverRef.current, handleClose);
    }
  }, [currentOpenValue]);

  const getWidth = useCallback((): number => {
    if (typeof props.width === 'string') {
      switch (props.width) {
        case 'inherit':
          return popoverRef.current?.parentElement ? popoverRef.current.parentElement.offsetWidth : 0;
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

  const rect = useMemo(() => ({
    x: getX(),
    y: getY(),
    width: getWidth(),
    height: props.height,
  }), [getX, getY, getWidth, props.height]);

  return <Template popoverRef={popoverRef} rect={rect} {...templateProps} />;
};

export default PopOverBehavior;
