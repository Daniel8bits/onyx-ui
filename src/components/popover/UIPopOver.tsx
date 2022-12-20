import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import onClickOutside, { OnClickOutsideCallback, OnClickOutsideCallbackRefObject } from '@utils/onClickOutside';
import { usePopOverStore } from '@store/store';
import UIScrollContainer from '@components/scrollContainer/UIScrollContainer';

interface UIPopOverProps {
    readonly id?: string
    width: number | 'inherit' | 'anchor'
    height: number | 'auto'
    anchor: React.MutableRefObject<HTMLElement|null>
    open?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right'
    scroll?: boolean
    template?: string
    className?: string
    children?: any
}

const UIPopOver: React.FC<UIPopOverProps> = (props) => {

    const {data, create, destroy, close} = usePopOverStore()
    
    const open = ((): boolean => {
      if(props.id) {
        const modal = data.filter(m => m[0] === props.id)[0]
        return (modal ? modal[1].open : false) as boolean
      }
      return props.open ?? false
    })()

    const ref = useRef<HTMLDivElement>(null);
    const event = useRef<OnClickOutsideCallback>(null);

    useEffect(() => {
      if(props.id) {
        create(props.id, props.open ?? false)
        return () => {
          if(props.id) destroy(props.id)
        }
      }
      return undefined
    }, []);

    const handleClose = useCallback(() => {
      if(props.id) close(props.id)
    }, []);

    useEffect(() => {
        if(props.id && open && ref.current) {

          const e = event as OnClickOutsideCallbackRefObject

          if(event.current) {
              document.removeEventListener('click', event.current, true)
              e.current = null
          }

          e.current = onClickOutside(ref.current, handleClose)
        }
    }, [open]);

    const getWidth = useCallback((): number => {
        if(typeof props.width === 'string') {
            switch (props.width) {
                case 'inherit':
                    return ref.current && ref.current.parentElement ? ref.current.parentElement.offsetWidth : 0
                case 'anchor':
                    return props.anchor.current ? 
                    props.anchor.current.offsetWidth : 0
                default:
                    break;
            }
        }
        return props.width as number        
    }, [props.width, props.anchor])

    const getX = useCallback((): number => {
        if(!props.anchor.current) {
            return 0;
        }
        const gap = 32
        const anchorX1 = props.anchor.current.offsetLeft
        const anchorX2 = anchorX1 + props.anchor.current.offsetWidth
        const popWidth = getWidth()
        if(props.position) {
            switch(props.position) {
                case 'top':
                case 'bottom':
                    return anchorX1+popWidth > window.innerWidth ?
                        anchorX2 - popWidth :
                        anchorX1
                case 'left':
                    return anchorX1 - popWidth - gap/2
                case 'right':
                    return anchorX2 + gap/2
                default:
                    break;
            }
        }
        else if(anchorX2+gap+popWidth < window.innerWidth) {
            return anchorX2 + gap/2
        }
        return anchorX1 - gap/2 - popWidth
    }, [props.anchor, getWidth, props.position])

    const getY = useCallback((): number => {
        if(!props.anchor.current) {
            return 0;
        }
        const gap = 8
        const anchorY1 = props.anchor.current.offsetTop
        const anchorY2 = anchorY1 + props.anchor.current.offsetHeight
        const popHeight = props.height === 'auto' ? 0 : props.height
        if(props.position) {
            switch(props.position) {
                case 'top':
                    return anchorY1 - popHeight - gap
                case 'bottom':
                    return anchorY2 + gap
                default:
                    break;
            }
        }
        if(anchorY2+popHeight < window.innerHeight) {
            return anchorY1
        }
        return anchorY2 - popHeight
    }, [props.anchor, props.height, props.position])

    return (
        <div 
          ref={ref}
          style={{
              top: `${getY()}px`,
              left: `${getX()}px`,
              width: `${getWidth()}px`,
              height: props.height === 'auto' ? props.height : `${props.height}px`
          }}
          className={`ui-popover ${props.template ?? ''} ${open ? 'open' : ''} ${props.className ?? ''}`}
        >
            {props.scroll && props.height !== 'auto' ? 
                <UIScrollContainer maxHeight={props.height-16}>
                        {props.children}
                </UIScrollContainer>
                : props.children}
        </div>
    );
};

export default UIPopOver;