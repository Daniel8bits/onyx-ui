import EventManager from '@internals/EventManager';
import {useMemo} from 'react';
import useUpdater from './useUpdater';

function useEventManager() {
  const [updater, update] = useUpdater();
  const eventManager = useMemo(() => new EventManager(update), []);

  const events = useMemo(() => eventManager.getEvents(), [updater]);

  return {events, eventManager};
}

export default useEventManager;
