import UIComponentCore from "./UIComponentCore";

export function Observable(defaultValue?: unknown) {
  return (target: any, key: string) => {
    console.log(target, key)
    target[key] = new UIObservable<unknown>(target as UIComponentCore, key, defaultValue)
  }
}

class UIObservable<T> {

  private _core: UIComponentCore
  private _key: string
  private _value?: T
  
  constructor(core: UIComponentCore, key: string, defaultValue?: T) {
    this._core = core
    this._key = key
    this._value = defaultValue
    core.watch(key, this)
  }

  public set(value?: T) {
    const oldValue = this._value
    this._value = value
    if(value === oldValue) return
    this._core.publish([this._key])
  }

  public get() {
    return this._value
  }

}

export default UIObservable