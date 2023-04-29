import type React from 'react';

export enum AquinoEvents {
  CLICK = 'onClick',
  MOUSEDOWN = 'onMouseDown',
  MOUSEUP = 'onMouseUp',

  KEYUP = 'onKeyUp',
  KEYDOWN = 'onKeyDown',
}

type MouseEvents = AquinoEvents.CLICK | AquinoEvents.MOUSEDOWN | AquinoEvents.MOUSEUP;
type KeyboardEvents = AquinoEvents.KEYUP | AquinoEvents.KEYDOWN;

type MouseEventCallback = (e: React.MouseEvent) => void;
type KeyboardEventCallback = (e: React.KeyboardEvent) => void;

export type AllEventsAsObject = 
  & Record<MouseEvents, MouseEventCallback>
  & Record<KeyboardEvents, KeyboardEventCallback>;

type MapKey = number | string | Symbol;

class EventManager {
  private readonly _events: 
    & Map<MouseEvents, Map<MapKey, MouseEventCallback>>
    & Map<KeyboardEvents, Map<MapKey, KeyboardEventCallback>>;

  private readonly _update: () => void;

  constructor(update: () => void) {
    this._events = new Map();
    this._update = update;

    this._events.set(AquinoEvents.CLICK, new Map());
    this._events.set(AquinoEvents.MOUSEDOWN, new Map());
    this._events.set(AquinoEvents.MOUSEUP, new Map());

    this._events.set(AquinoEvents.KEYUP, new Map());
    this._events.set(AquinoEvents.KEYDOWN, new Map());

    this.getEvents = this.getEvents.bind(this);
  }

  public getEvents(): Partial<AllEventsAsObject> {
    const e: Partial<AllEventsAsObject> = {};
    this._events.forEach((listener, event) => {
      e[event] = ev => listener.forEach(fn => fn(ev));
    });
    return e;
  }

  public add(id: MapKey, event: MouseEvents, fn: MouseEventCallback): void;
  public add(id: MapKey, event: KeyboardEvents, fn: KeyboardEventCallback): void; 
  public add(id: MapKey, event: unknown, fn: unknown) {
    if (this._events.has(event as MouseEvents)) {
      const map = this._events.get(event as MouseEvents);
      if (!map) return;
      if (map.has(id) && new Set([...map.values()]).has(fn as MouseEventCallback)) return;
      map.set(id, fn as MouseEventCallback);
      this._update();
    }
  }

  public remove(id: MapKey, event: MouseEvents, fn: MouseEventCallback): void;
  public remove(id: MapKey, event: KeyboardEvents, fn: KeyboardEventCallback): void; 
  public remove(id: MapKey, event: unknown, fn: unknown) {
    if (this._events.has(event as MouseEvents)) {
      const map = this._events.get(event as MouseEvents);
      if (!map) return;
      if (!map.has(id)) return;
      map.delete(id);
      this._update();
    }
  }
}

export default EventManager;
