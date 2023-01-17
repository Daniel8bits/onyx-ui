import ComponentCore from '@components/ComponentCore';
import Observable from '@components/Observable';

export type Mask = Array<string | RegExp>;

class TextfieldCore extends ComponentCore {
  private readonly _mask: Observable<Nullable<Mask>>;
  private _decomposedMask: Nullable<Mask>;

  constructor(mask: Nullable<Mask>) {
    super();
    this._mask = new Observable(this, 'mask', mask);
    this._decomposeMask();
  }

  private _decomposeMask() {
    const mask = this._mask.get();
    if (!mask) return;
    let decomposedMask: Array<string | RegExp> = [];
    mask.forEach(value => {
      if (value instanceof RegExp) {
        decomposedMask.push(value);
        return;
      }

      decomposedMask = decomposedMask.concat(value.split(''));
    });
    this._decomposedMask = decomposedMask;
  }

  public get decomposedMask() {
    return this._decomposedMask;
  }
}

export default TextfieldCore;
