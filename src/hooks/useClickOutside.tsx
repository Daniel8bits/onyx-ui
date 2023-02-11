import {OnyxEvents} from '@internals/EventManager';
import {useRoot} from '@internals/Root';
import {type OnClickOutsideCallback} from '@utils/onClickOutside';
import {useCallback, useRef} from 'react';

function useClickOutside(): [
  (element: HTMLElement, callback: () => void) => void,
  () => void,
] {
  const {root} = useRoot();
  const event = useRef<OnClickOutsideCallback>(null);

  const onClickOutside = useCallback((element: HTMLElement, callback: () => void) => {
    const fn = (e: React.MouseEvent) => {
      if (element && !element.contains(e.target as HTMLElement)) {
        callback();
        root?.eventListeners.remove(OnyxEvents.CLICK, fn);
      }
    };

    root?.eventListeners.add(OnyxEvents.CLICK, fn);

    event.current = fn;
  }, [root]);

  const removeClickOutside = useCallback(() => {
    if (event.current) {
      root?.eventListeners.remove(OnyxEvents.CLICK, event.current);
      event.current = null;
    }
  }, [root]);

  return [onClickOutside, removeClickOutside];
}

export default useClickOutside;
