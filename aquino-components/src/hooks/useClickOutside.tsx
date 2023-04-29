import {AquinoEvents} from '@internals/EventManager';
import {useRoot} from '@internals/Root';
import {useCallback, useRef} from 'react';

type OnClickOutsideCallback = ((e: React.MouseEvent) => void) | null;

function useClickOutside(): [
  (element: HTMLElement, callback: () => void) => void,
  () => void,
] {
  const {root} = useRoot();
  const event = useRef<OnClickOutsideCallback>(null);
  const idRef = useRef(Symbol('useClickOutside'));

  const onClickOutside = useCallback((element: HTMLElement, callback: () => void) => {
    const fn = (e: React.MouseEvent) => {
      if (element && !element.contains(e.target as HTMLElement)) {
        callback();
        root?.eventListeners.remove(idRef.current, AquinoEvents.CLICK, fn);
      }
    };

    root?.eventListeners.add(idRef.current, AquinoEvents.CLICK, fn);

    event.current = fn;
  }, [root]);

  const removeClickOutside = useCallback(() => {
    if (event.current) {
      root?.eventListeners.remove(idRef.current, AquinoEvents.CLICK, event.current);
      event.current = null;
    }
  }, [root]);

  return [onClickOutside, removeClickOutside];
}

export default useClickOutside;
