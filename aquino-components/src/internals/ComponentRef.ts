import type EventManager from './EventManager';

interface ComponentRef {
  eventListeners: EventManager;
  el: HTMLElement;
}

export default ComponentRef;
