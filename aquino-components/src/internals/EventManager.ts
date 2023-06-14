import type React from 'react';

export enum AquinoEvents {
  CLICK = 'onClick',
  MOUSEDOWN = 'onMouseDown',
  MOUSEUP = 'onMouseUp',
  MOUSEMOVE = 'onMouseMove',

  KEYUP = 'onKeyUp',
  KEYDOWN = 'onKeyDown',

  WHEEL = 'onWheel',

  FOCUS = 'onFocus',
  BLUR = 'onBlur',
}

export type MouseEvents = AquinoEvents.CLICK | AquinoEvents.MOUSEDOWN | AquinoEvents.MOUSEUP | AquinoEvents.MOUSEMOVE;
export type KeyboardEvents = AquinoEvents.KEYUP | AquinoEvents.KEYDOWN;
export type WheelEvents = AquinoEvents.WHEEL;
export type FocusEvents = AquinoEvents.FOCUS | AquinoEvents.BLUR;

export type MouseEventCallback = (e: React.MouseEvent) => void;
export type KeyboardEventCallback = (e: React.KeyboardEvent) => void;
export type WheelEventCallback = (e: React.WheelEvent) => void;
export type FocusEventCallback = (e: React.FocusEvent) => void;

export type AllEventsAsObject = 
  & Record<MouseEvents, MouseEventCallback>
  & Record<KeyboardEvents, KeyboardEventCallback>
  & Record<WheelEvents, WheelEventCallback>
  & Record<FocusEvents, FocusEventCallback>;

type MapKey = number | string | Symbol;

class EventManager {
  private readonly _events: 
    & Map<MouseEvents, Map<MapKey, MouseEventCallback>>
    & Map<KeyboardEvents, Map<MapKey, KeyboardEventCallback>>
    & Map<WheelEvents, Map<MapKey, WheelEventCallback>>
    & Map<FocusEvents, Map<MapKey, FocusEventCallback>>;

  private readonly _update: () => void;

  constructor(update: () => void) {
    this._events = new Map();
    this._update = update;

    this._events.set(AquinoEvents.CLICK, new Map());
    this._events.set(AquinoEvents.MOUSEDOWN, new Map());
    this._events.set(AquinoEvents.MOUSEUP, new Map());
    this._events.set(AquinoEvents.MOUSEMOVE, new Map());

    this._events.set(AquinoEvents.KEYUP, new Map());
    this._events.set(AquinoEvents.KEYDOWN, new Map());

    this._events.set(AquinoEvents.WHEEL, new Map());

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
  public add(id: MapKey, event: WheelEvents, fn: WheelEventCallback): void; 
  public add(id: MapKey, event: FocusEvents, fn: FocusEventCallback): void; 
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
  public remove(id: MapKey, event: WheelEvents, fn: WheelEventCallback): void; 
  public remove(id: MapKey, event: FocusEvents, fn: FocusEventCallback): void; 
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
