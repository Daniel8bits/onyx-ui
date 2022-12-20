import UIObservable from "./UIObservable"

export type PropertyObserver<T> = (value: T) => any

class UIComponentCore {

  private _variablesBeingWatched: Map<string, UIObservable<any>>
  private _observers: Map<string, Set<() => void>>

  constructor() {
    this._variablesBeingWatched = new Map()
    this._observers = new Map()
  }

  protected subscribe(variablesBeingWatched: string[], componentUpdater: () => void) {
    variablesBeingWatched.forEach(variable => {

      if(!this._variablesBeingWatched.has(variable)) return

      const updaters = this._observers.get(variable) ?? new Set()
      updaters.add(componentUpdater)
      this._observers.set(variable, updaters)

    })
  }

  protected unsubscribe(variablesBeingWatched: string[], componentUpdater: () => void) {
    variablesBeingWatched.forEach(variable => {

      if(!this._variablesBeingWatched.has(variable)) return

      const updaters = this._observers.get(variable)
      if(!updaters) return

      updaters.delete(componentUpdater)

    })
  }

  public publish(variables: string[]) {
    variables.forEach((variable) => {
      this._observers.get(variable)?.forEach(update => update())
    })
  }

  public watch(key: string, observable: UIObservable<any>) {
    this._variablesBeingWatched.set(key, observable)
  }

}

export default UIComponentCore