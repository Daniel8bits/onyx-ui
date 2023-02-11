import type React from 'react';
import componentSelector from '@internals/ComponentSelector';
import {OnyxEvents} from '@internals/EventManager';

export type OnClickOutsideCallback = ((e: React.MouseEvent) => void) | null;
export type OnClickOutsideCallbackRefObject = React.MutableRefObject<OnClickOutsideCallback>;

function onClickOutside(element: HTMLElement, callback: () => void): (e: React.MouseEvent) => void {
  const event = (e: React.MouseEvent) => {
    if (element && !element.contains(e.target as HTMLElement)) {
      callback();
      componentSelector.root?.eventListeners.remove(OnyxEvents.CLICK, event);
    }
  };

  componentSelector.root?.eventListeners.add(OnyxEvents.CLICK, event);
  return event;
}

export default onClickOutside;
