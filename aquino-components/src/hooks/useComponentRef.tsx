import {useState} from 'react';
import {type AquinoBehavior, type AquinoComponent} from '@internals/ThemeManager';

function useComponentRef<T extends AquinoBehavior<any, any> | AquinoComponent<any>>(): [
  ComponentRefType<T> | undefined, 
  StateSetter<ComponentRefType<T> | undefined>,
] {
  return useState<ComponentRefType<T>>();
}

export default useComponentRef;
