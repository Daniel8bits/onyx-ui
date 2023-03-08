import type EventManager from './EventManager';

interface OnyxComponentRef {
  eventListeners: EventManager;
  el: HTMLElement;
}

export default OnyxComponentRef;
