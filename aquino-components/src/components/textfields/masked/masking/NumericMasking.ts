import Masking from './Masking';

class NumericMasking extends Masking {
  private _shouldUpdate: boolean;
  private _minStringValue: string;
  private _maxStringValue: string;

  constructor(
    private _max: number | undefined,
    private _min: number | undefined,
  ) {
    super();
    this._shouldUpdate = true;
    this._minStringValue = '';
    this._maxStringValue = '';
  }

  public setMax(max: number | undefined) {
    this._max = max;
    this._shouldUpdate = true;
  }

  public setMin(min: number | undefined) {
    this._min = min;
    this._shouldUpdate = true;
  }

  /*   
  
    [LEGENDA]

    cp: caretPosition
    av: actualValue
    min: valor minimo aceitavel

    [CASOS]

    - cp = 0, av = 0
    - cp = av, av > 0
    - cp > 0, av > 0, cp < av, cp < min
    - cp > 0, av > 0, cp < av, cp >= min
    - cp = 0, av > 0
  
  */
  protected _processWhenInterval(key: string, caretPosition: number, min: string): [string, number] {
    const av = this._actualValue;
    const m = min;
    const cp = caretPosition;
    let v = '';

    if (cp === 0 && av.length === 0) {
      v = key === '-'
        ? m
        : key + m.substring(1);
    } else if (cp === av.length && av.length > 0) {
      v = av + key;
    } else if (cp > 0 && av.length > 0 && cp < av.length && cp < m.length) {
      v = av.substring(0, cp) + key + av.substring(cp + 1);
    } else if (cp > 0 && av.length > 0 && cp < av.length && cp >= m.length) {
      v = av.substring(0, cp) + key + av.substring(cp);
    } else if (cp === 0 && av.length > 0) {
      v = key + av.substring(1);
    }

    return [v, caretPosition + 1];
  }

  protected _processWhenDashAndNormalInterval(caretPosition: number): [string, number] {
    const av = this._actualValue;
    const cp = caretPosition;
    if (cp === 0 && av.length === 0) return ['-0', cp + 1];
    return [av + '-', cp + 1];
  }

  protected _processWhenNoInterval(key: string, caretPosition: number): [string, number] {
    const av = this._actualValue;
    const v = caretPosition < av.length
      ? av.substring(0, caretPosition) + key + av.substring(caretPosition)
      : av + key;
    return [v, caretPosition + 1];
  }

  protected _processValue(key: string, caretPosition: number, done: (displayValue: string, caretPosition: number, accepted: boolean, reject: () => void) => void): [string, number] {
    this._updateDigits();
    
    const {_max: max, _min: min} = this;

    // Possui intervalo fechado
    if (max !== undefined && min !== undefined) {
      // Quando intervalo for totalmente positivo
      if (min > 0) return this._processWhenInterval(key, caretPosition, this._minStringValue);

      // Quando intervalo for totalmente negativo
      if (max < 0) return this._processWhenInterval(key, caretPosition, this._maxStringValue);

      return key === '-'
        ? this._processWhenDashAndNormalInterval(caretPosition)
        : this._processWhenNoInterval(key, caretPosition);
    }

    // Quando o maior valor for negativo
    if (max !== undefined && max < 0) return this._processWhenInterval(key, caretPosition, this._maxStringValue);

    // Quando o menor valor por positivo
    if (min !== undefined && min > 0) return this._processWhenInterval(key, caretPosition, this._minStringValue);

    return this._processWhenNoInterval(key, caretPosition);
  }

  protected _processValueOnBackspace(key: string, caretPosition: number, done: (displayValue: string, caretPosition: number, accepted: boolean, reject: () => void) => void): [string, number] {
    this._updateDigits();

    const {_max: max, _min: min} = this;
    const av = this._actualValue;

    if (av.length === 0) return [av, caretPosition];

    let v = '';
    let p = caretPosition;

    if (max !== undefined && max < 0) {
      v = caretPosition <= this._maxStringValue.length 
        ? ''
        : av.substring(0, caretPosition - 1) + av.substring(caretPosition);
      p = caretPosition <= this._maxStringValue.length 
        ? 0
        : caretPosition - 1;
    } else if (min !== undefined && min > 0) {
      v = caretPosition <= this._minStringValue.length 
        ? ''
        : av.substring(0, caretPosition - 1) + av.substring(caretPosition);
      p = caretPosition <= this._minStringValue.length 
        ? 0
        : caretPosition - 1;
    } else {
      v = av.substring(0, caretPosition - 1) + av.substring(caretPosition);
      p = caretPosition - 1;
    }

    return [v, p];
  }

  protected _updateDigits() {
    if (!this._shouldUpdate) return;
    const {_max: max, _min: min} = this;

    if (min !== undefined && !(min > -10 && min < 10)) {
      const zeros = min < 0 
        ? String(this._min).length - 2 
        : String(this._min).length - 1;

      const nonZero = Number(min.toString().substring(0, min < 0 ? 2 : 1));
      this._minStringValue = String(nonZero * 10 ** zeros);
    }

    if (max !== undefined && !(max > -10 && max < 10)) {
      const zeros = max < 0 
        ? String(max).length - 2 
        : String(max).length - 1;

      const nonZero = Number(max.toString().substring(0, max < 0 ? 2 : 1));
      this._maxStringValue = String(nonZero * 10 ** zeros);
    }

    this._shouldUpdate = false;
  }

  protected _isValidKey(key: string, caretPosition: number): boolean {
    return (
      (key >= '0' && key <= '9')
        || key === '-'
        || key === '.'
    );
  }

  protected _isValidValue(value: string): boolean {
    if (value === '') return true;
    const lessThanMin = this._min !== undefined && Number(value) < this._min;
    const moreThanMax = this._max !== undefined && Number(value) > this._max;
    return !lessThanMin && !moreThanMax && !isNaN(Number(value));
  }
}

export default NumericMasking;
