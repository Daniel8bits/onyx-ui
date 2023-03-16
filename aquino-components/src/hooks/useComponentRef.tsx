import type ComponentRef from '@internals/ComponentRef';
import {useEffect, useRef} from 'react';
import useEventManager from './useEventManager';

function useComponentRef<T extends HTMLElement>(forwardRef: ComponentRef | undefined) {
  const ref = useRef<T>(null);
  const {events, eventManager} = useEventManager();

	useEffect(() => {
		if (ref.current && forwardRef) {
			forwardRef.el = ref.current;
      forwardRef.eventListeners = eventManager;
		}
	}, [forwardRef]);

  return {ref, events, eventManager};
}

export default useComponentRef;
