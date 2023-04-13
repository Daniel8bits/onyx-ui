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

class EventManager {
  private readonly _events: 
    & Map<MouseEvents, Set<MouseEventCallback>>
    & Map<KeyboardEvents, Set<KeyboardEventCallback>>;

  private readonly _update: () => void;

  constructor(update: () => void) {
    this._events = new Map();
    this._update = update;

    this._events.set(AquinoEvents.CLICK, new Set());
    this._events.set(AquinoEvents.MOUSEDOWN, new Set());
    this._events.set(AquinoEvents.MOUSEUP, new Set());

    this._events.set(AquinoEvents.KEYUP, new Set());
    this._events.set(AquinoEvents.KEYDOWN, new Set());

    this.getEvents = this.getEvents.bind(this);
  }

  public getEvents(): Partial<AllEventsAsObject> {
    const e: Partial<AllEventsAsObject> = {};
    this._events.forEach((listener, event) => {
      e[event] = ev => listener.forEach(fn => fn(ev));
    });
    return e;
  }

  public add(event: MouseEvents, fn: MouseEventCallback): void;
  public add(event: KeyboardEvents, fn: KeyboardEventCallback): void; 
  public add(event: unknown, fn: unknown) {
    if (this._events.has(event as MouseEvents)) {
      const set = this._events.get(event as MouseEvents);
      if (!set) return;
      if (set.has(fn as MouseEventCallback)) return;
      set.add(fn as MouseEventCallback);
      this._update();
    }
  }

  public remove(event: MouseEvents, fn: MouseEventCallback): void;
  public remove(event: KeyboardEvents, fn: KeyboardEventCallback): void; 
  public remove(event: unknown, fn: unknown) {
    if (this._events.has(event as MouseEvents)) {
      const set = this._events.get(event as MouseEvents);
      if (!set) return;
      if (!set.has(fn as MouseEventCallback)) return;
      set.delete(fn as MouseEventCallback);
      this._update();
    }
  }
}

export default EventManager;
