import type React from 'react';

export enum OnyxEvents {
  CLICK = 'onClick',
  MOUSEDOWN = 'onMouseDown',
  MOUSEUP = 'onMouseUp',
}

export type OnyxMouseEventCallback = (e: React.MouseEvent) => void;

class EventManager {
  private readonly _mouseEvents: Map<OnyxEvents, Set<OnyxMouseEventCallback>>;

  constructor() {
    this._mouseEvents = new Map();
    this._mouseEvents.set(OnyxEvents.CLICK, new Set());
    this._mouseEvents.set(OnyxEvents.MOUSEDOWN, new Set());
    this._mouseEvents.set(OnyxEvents.MOUSEUP, new Set());
  }

  public get events() {
    return [...this._mouseEvents];
  }

  public add(event: OnyxEvents, fn: OnyxMouseEventCallback) {
    if (this._mouseEvents.has(event)) {
      this._mouseEvents.get(event)?.add(fn);
    }
  }

  public remove(event: OnyxEvents, fn: OnyxMouseEventCallback) {
    if (this._mouseEvents.has(event)) {
      this._mouseEvents.get(event)?.delete(fn);
    }
  }
}

export default EventManager;
