import {type ComponentRefObject} from '@internals/ComponentRef';
import type {AquinoEvents, MouseEvents, KeyboardEvents, WheelEvents, MouseEventCallback, KeyboardEventCallback, WheelEventCallback} from '@internals/EventManager';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import uniqid from 'uniqid';

type EventHandlerType = 
  & ((event: MouseEvents, fn: MouseEventCallback) => void)
  & ((event: KeyboardEvents, fn: KeyboardEventCallback) => void)
  & ((event: WheelEvents, fn: WheelEventCallback) => void);

function useRootEventManager(root?: Omit<ComponentRefObject, 'super'>) {
  const eventsRefs = useRef<Map<AquinoEvents, Map<Function, string>>>(new Map());
  
  // Unmounting
  useEffect(() => () => {
    if (!root) return;
    const maps = eventsRefs.current;
    maps.forEach((ids, ev) => ids.forEach((id, fn) => 
      root.eventListeners.remove(id, ev as unknown as MouseEvents, fn as unknown as MouseEventCallback)));
  }, [root]);

  const add = useCallback<EventHandlerType>((event: unknown, func: unknown) => {
    if (!root) return;
    const maps = eventsRefs.current;
    const e = event as MouseEvents;
    const fn = func as MouseEventCallback;
    if (!maps.has(e)) maps.set(e, new Map());
    if (!maps.get(e)?.has(fn)) maps.get(e)?.set(fn, uniqid());
    const id = maps.get(e)!.get(fn)!;
    root.eventListeners.add(id, e, fn);
  }, [root]);

  const remove = useCallback<EventHandlerType>((event: unknown, func: unknown) => {
    if (!root) return;
    const maps = eventsRefs.current;
    const e = event as MouseEvents;
    const fn = func as MouseEventCallback;
    if (!maps.has(e)) return;
    if (!maps.get(e)?.has(fn)) return;
    const id = maps.get(e)!.get(fn)!;
    root.eventListeners.remove(id, e, fn);
    maps.get(e)?.delete(fn);
  }, [root]);

  const rootEventManager = useMemo(() => ({add, remove}), [add, remove]);

  return rootEventManager;
}

export default useRootEventManager;
