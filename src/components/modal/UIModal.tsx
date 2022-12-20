import React, { useCallback, useEffect, useRef } from 'react';

import onClickOutside, { OnClickOutsideCallbackRefObject } from '@utils/onClickOutside';
import { useModalStore } from '@store/store';


interface UIModalProps<T extends AnyObject> {
    readonly id?: string
    open?: boolean;
    template?: string
    className?: string
    children?: any
    params?: T
    disableClickOutside?: boolean
}

function UIModal<T extends AnyObject>(props: UIModalProps<T>) {

  const {data, create, destroy, close} = useModalStore()
  
  const currentOpenValue = ((): boolean => {
    if(props.id) {
      const modal = data.filter(m => m[0] === props.id)[0]
      return (modal ? modal[1].open : false) as boolean
    }
    return props.open ?? false
  })()

  const ref = useRef<HTMLDivElement>(null);
  const event = useRef<(e: MouseEvent) => void>(null);

  useEffect(() => {
    if(props.id) {

      create(props.id, props.open ?? false, props.params)

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
    if(props.id && currentOpenValue && ref.current && !props.disableClickOutside) {

      const e = event as OnClickOutsideCallbackRefObject

      if(event.current) {
        document.removeEventListener('click', event.current)
        e.current = null
      }

      e.current = onClickOutside(ref.current, handleClose)
    }
  }, [props.id, currentOpenValue, props.disableClickOutside]);

    return (
      <div className={`ui-modal ${props.template ?? ''} ${currentOpenValue ? 'open' : ''} ${props.className ?? ''}`}>
          <div ref={ref}>
              {props.children}
          </div>
      </div>
    );
}

export default UIModal;