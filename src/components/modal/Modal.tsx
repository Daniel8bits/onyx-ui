import React from 'react';
import ModalTemplate from './ModalTemplate';
import ModalBehavior from './ModalBehavior';


export interface ModalProps<T extends AnyObject = AnyObject> {
    readonly id?: string
    open?: boolean;
    template?: string
    className?: string
    children?: any
    params?: T
    disableClickOutside?: boolean
}

function Modal<T extends AnyObject = AnyObject>(props: ModalProps<T>) {
  return <ModalBehavior<T> Template={ModalTemplate} {...props}  />
}

export default Modal;