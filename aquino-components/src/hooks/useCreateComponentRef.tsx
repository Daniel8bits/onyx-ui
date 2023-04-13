import type ComponentRef from '@internals/ComponentRef';
import {useEffect, useRef} from 'react';
import useEventManager from './useEventManager';
import {type AquinoBehavior, type AquinoComponent} from '@internals/ThemeManager';
import type useComponentRef from './useComponentRef';
import {type ComponentRefObject} from '@internals/ComponentRef';

type ElType_<T extends AquinoBehavior<any, any> | AquinoComponent<any>> = NonNullable<ComponentRefType<T>>;
type ElType<T extends AquinoBehavior<any, any> | AquinoComponent<any>> = 
  ElType_<T> extends ComponentRefObject ? ElType_<T>['el'] : never;

type Attributes<T extends AquinoBehavior<any, any> | AquinoComponent<any>> =
  Omit<NonNullable<ComponentRefType<T>>, keyof ComponentRefObject>;

function useCreateComponentRef<T extends AquinoBehavior<any, any> | AquinoComponent<any>>(
  ...args: ComponentRefObject extends Attributes<T> 
    ? [StateSetter<ComponentRefType<T>> | undefined] 
    : [StateSetter<ComponentRefType<T>> | undefined, Attributes<T>]
) {
  const [forwardRef, attributes] = args;
  const ref = useRef<ElType<T>>(null);
  const {events, eventManager} = useEventManager();

	useEffect(() => {
    if (!(ref.current && forwardRef)) return;
    forwardRef({
      el: ref.current, 
      eventListeners: eventManager,
      ...(attributes ?? {}),
    } as ComponentRefType<T>);
	}, []);

  return {ref, events, eventManager};
}

export default useCreateComponentRef;
