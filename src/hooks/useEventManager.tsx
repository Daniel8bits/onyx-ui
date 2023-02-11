import EventManager, {type OnyxMouseEventCallback, type OnyxEvents} from '@internals/EventManager';
import {useMemo} from 'react';

function useEventManager() {
  const eventManager = useMemo(() => new EventManager(), []);

  const events = useMemo(() => {
    const e: Partial<Record<OnyxEvents, OnyxMouseEventCallback>> = {};
    eventManager.events.forEach(listener => {
      e[listener[0]] = ev => listener[1].forEach(fn => fn(ev));
    });
    return e;
  }, []);

  return {events, eventManager};
}

export default useEventManager;
