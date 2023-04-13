import type EventManager from './EventManager';
import {type AquinoComponent} from './ThemeManager';

export interface ComponentRefObject<E extends HTMLElement = HTMLElement> {
  eventListeners: EventManager;
  el: E;
}

type ComponentRef<E extends HTMLElement = HTMLElement, R = {}> = StateSetter<R & ComponentRefObject<E> | undefined>;

export default ComponentRef;
