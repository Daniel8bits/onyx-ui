import type Observable from './Observable';

export type PropertyObserver<T> = (value: T) => any;

class ComponentCore {
  private readonly _variablesBeingWatched: Map<string, Observable<any>>;
  private readonly _observers: Map<string, Set<() => void>>;

  constructor() {
    this._variablesBeingWatched = new Map();
    this._observers = new Map();
  }

  public publish(variables: string[]) {
    variables.forEach(variable => {
      this._observers.get(variable)?.forEach(update => update());
    });
  }

  public watch(key: string, observable: Observable<any>) {
    this._variablesBeingWatched.set(key, observable);
  }

  protected subscribe(variablesBeingWatched: string[], componentUpdater: () => void) {
    variablesBeingWatched.forEach(variable => {
      if (!this._variablesBeingWatched.has(variable)) return;

      const updaters = this._observers.get(variable) ?? new Set();
      updaters.add(componentUpdater);
      this._observers.set(variable, updaters);
    });
  }

  protected unsubscribe(variablesBeingWatched: string[], componentUpdater: () => void) {
    variablesBeingWatched.forEach(variable => {
      if (!this._variablesBeingWatched.has(variable)) return;

      const updaters = this._observers.get(variable);
      if (!updaters) return;

      updaters.delete(componentUpdater);
    });
  }
}

export default ComponentCore;
