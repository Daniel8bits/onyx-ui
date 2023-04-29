import type ComponentRef from '@internals/ComponentRef';
import {useCallback, useEffect, useRef, useState} from 'react';
import useEventManager from './useEventManager';
import {type AquinoBehavior, type AquinoComponent} from '@internals/ThemeManager';
import type useComponentRef from './useComponentRef';
import {type ComponentRefObject} from '@internals/ComponentRef';
import type EventManager from '@internals/EventManager';

type ElType_<T> = NonNullable<ComponentRefType<T>>;
export type ElType<T> = 
  ElType_<T> extends ComponentRefObject ? ElType_<T>['el'] : never;

export type RefAttributes<T> =
  Omit<NonNullable<ComponentRefType<T>>, keyof ComponentRefObject>;

export type SuperSetter<T> = (attr: Partial<RefAttributes<T>>) => void;

function useCreateComponentRef<T extends AquinoBehavior<any, any> | AquinoComponent<any>>(
  ...args: ComponentRefObject extends RefAttributes<T> 
    ? [StateSetter<ComponentRefType<T>> | undefined] 
    : [StateSetter<ComponentRefType<T>> | undefined, (ref: React.RefObject<ElType<T>>, eventManager: EventManager) => RefAttributes<T>]
) {
  const [forwardRef, getAttributes] = args;
  const ref = useRef<ElType<T>>(null);
  const {events, eventManager} = useEventManager();
  const [attributes, setAttributes] = useState<RefAttributes<T>>();

  const updateState = useCallback<(
    ref: React.RefObject<ElType<T>>,
    eventManager: EventManager,
    attr: RefAttributes<T>,
  ) => void>((ref, eventManager, attr) => {
    const super_: SuperSetter<T> = attr => {
      console.log(attr);
      setAttributes(state => state === undefined ? undefined : {...state, ...attr});
    };
    
    console.log(attr);
    forwardRef?.({
      el: ref.current, 
      eventListeners: eventManager,
      ...attr,
      super: super_,
    } as ComponentRefType<T>);

    setAttributes({...attr});
  }, [forwardRef]);

	useEffect(() => {
    if (!(ref.current && forwardRef)) return;
    const attr = getAttributes ? getAttributes(ref, eventManager) : {};
    updateState(ref, eventManager, attr as RefAttributes<T>);
	}, []);

  return {attributes, ref, events, eventManager};
}

export default useCreateComponentRef;
