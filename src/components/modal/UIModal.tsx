import React from 'react';
import UIModalTemplate from './UIModalTemplate';
import UIModalBehavior from './UIModalBehavior';


export interface UIModalProps<T extends AnyObject = AnyObject> {
    readonly id?: string
    open?: boolean;
    template?: string
    className?: string
    children?: any
    params?: T
    disableClickOutside?: boolean
}

function UIModal<T extends AnyObject = AnyObject>(props: UIModalProps<T>) {
  return <UIModalBehavior<T> Template={UIModalTemplate} {...props}  />
}

export default UIModal;