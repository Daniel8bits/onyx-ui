
abstract class Masking {
  protected _actualValue: string;
  protected _displayValue: string;
  protected _previousValue: string;

  constructor() {
    this._actualValue = '';
    this._displayValue = '';
    this._previousValue = '';
    this._reject = this._reject.bind(this);
  }

  public getDisplayValue() {
    return this._displayValue;
  }

  public update(key: string, caretPosition: number, done: (displayValue: string, caretPosition: number, accepted: boolean, reject: () => void) => void): void {
    const value = this._actualValue;
    this._previousValue = value;

    const isBackspace = key === 'Backspace';

    if (!isBackspace && !this._isValidKey(key, caretPosition)) {
      this._displayValue = this._actualValue;
      done(value, caretPosition, false, this._reject);
      return;
    }

    const [newValue, newCaretPosition] = isBackspace
      ? this._processValueOnBackspace(key, caretPosition, done)
      : this._processValue(key, caretPosition, done);

    if (this._isValidValue(newValue)) {
      this._displayValue = newValue;
      this._actualValue = newValue;
      done(newValue, newCaretPosition, true, this._reject);
    }
  }

  protected _reject() {
    this._actualValue = this._previousValue;
  }

  protected abstract _processValue(key: string, caretPosition: number, done: (displayValue: string, caretPosition: number, accepted: boolean, reject: () => void) => void): [string, number];
  protected abstract _processValueOnBackspace(key: string, caretPosition: number, done: (displayValue: string, caretPosition: number, accepted: boolean, reject: () => void) => void): [string, number];
  protected abstract _isValidKey(key: string, caretPosition: number): boolean;
  protected abstract _isValidValue(value: string): boolean;  
}

export default Masking;
