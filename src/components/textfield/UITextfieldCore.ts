import UIComponentCore from "@components/UIComponentCore";
import UIObservable from "@components/UIObservable";

export type UIMask = (string|RegExp)[]

class UITextfieldCore extends UIComponentCore {

  private _mask: UIObservable<Nullable<UIMask>>
  private _decomposedMask: Nullable<UIMask>

  constructor(mask: Nullable<UIMask>) {
    super()
    this._mask = new UIObservable(this, 'mask', mask);
    this._decomposeMask()
  }

  private _decomposeMask() {
    const mask = this._mask.get()
    if(!mask) return
    let decomposedMask: (string|RegExp)[] = []
    mask.forEach(value => {
      if(value instanceof RegExp) {
        decomposedMask.push(value)
        return
      }
      decomposedMask = decomposedMask.concat(value.split(''))
    })
    this._decomposedMask = decomposedMask
  }

  public get decomposedMask() {
    return this._decomposedMask
  }

}

export default UITextfieldCore