import type ComponentCore from './ComponentCore';

class Observable<T> {
  private readonly _core: ComponentCore;
  private readonly _key: string;
  private _value?: T;
  
  constructor(core: ComponentCore, key: string, defaultValue?: T) {
    this._core = core;
    this._key = key;
    this._value = defaultValue;
    core.watch(key, this);
  }

  public set(value?: T) {
    const oldValue = this._value;
    this._value = value;
    if (value === oldValue) return;
    this._core.publish([this._key]);
  }

  public get() {
    return this._value;
  }
}

export default Observable;
