/* eslint-disable react/prop-types */

import React, {useCallback, useEffect} from 'react';
import type TextfieldTemplate from '@components/textfield/TextfieldTemplate';
import {type TextfieldProps} from '@components/textfield/TextfieldTemplate';
import {type AquinoBehavior} from '@internals/ThemeManager';
import TextfieldBehavior from '@components/textfield/TextfieldBehavior';
import {AquinoEvents} from '@internals/EventManager';
import useNew from '@hooks/useNew';
import useExtendsComponentRef from '@hooks/useExtendsComponentRef';

/*

TODO:
  * Passar o algoritmo de mascara para a classe [OK]
  * A classe deve ser extesível para outros tipos de mascarágem
  * Deve funcionar bem tanto com typing quanto com inserção de valor por ref
  * Deve ser autofixável
  * Deve funcionar para qualquer elemento

*/

class Masking {
  private _actualValue!: string;
  private _displayValue!: string;
  private _mask: string;

  private _base!: string; 
  private _regex!: RegExp;
  private _curlyBracketsBegins!: number[];
  private _curlyBracketsEnds!: number[];
  private _inverseSlashPositions!: number[];

  private _onExternalValueUpdateCallback?: (dV: string) => void;

  constructor(mask: string) {
    this._mask = mask;
    this._processMask();
  }

  public getDisplayValue() {
    return this._displayValue;
  }

  public setMask(mask: string) {
    this._mask = mask;
    this._processMask();
  }

  public onExternalValueUpdate(onExternalValueUpdateCallback: (dV: string) => void) {
    this._onExternalValueUpdateCallback = onExternalValueUpdateCallback;
  }

  public externalUpdate(value: string, caretBeginPosition: number) {
    if (!this._onExternalValueUpdateCallback) return;
    const fn = this._onExternalValueUpdateCallback;
    value.split('').forEach((v, i) => this._update(v, caretBeginPosition + i, fn));
  }

  public update(key: string, caretPosition: number, done: (displayValue: string, caretPosition: number, accepted: boolean) => void) {
    this._update(key, caretPosition, done);
  }

  // eslint-disable-next-line complexity
  private _update(key: string, caretPosition: number, done: (displayValue: string, caretPosition: number, accepted: boolean) => void) {
    const displayValue = this._displayValue;
    let value = this._actualValue;
    
    if (
      key !== 'Backspace' && (
      caretPosition >= displayValue.length
      || key.length !== 1
      || !(key >= 'a' && key <= 'z' 
      || key >= 'A' && key <= 'Z' 
      || key >= '0' && key <= '9'
      || key === ' '))
    ) {
      this._displayValue = this._actualValue;
      done(value, caretPosition, false);
      return;
    }

    const aux = value.split('');
    const switchedP: [boolean] = [false];
    let newCaretPosition: Nullable<number> = null;
    let curlyBracket = false;
    let inverseSlash = false;
    value = '';

    const setValueAndCaret = (v: string, p: number) => {
      value = v;
      newCaretPosition = p;
    };

    let maskPosition = 0;
    const find = (arr: number[], value: number): boolean => 
                arr.find(position => position === value) !== undefined;

    for (let i = 0; i < this._base.length; i++) {
      maskPosition = this._getCurrentMaskPosition(i);
      if (!curlyBracket) {
        if (!inverseSlash && find(this._inverseSlashPositions, maskPosition)) {
          inverseSlash = true;
          continue;
        } else if (!inverseSlash && find(this._curlyBracketsBegins, maskPosition - 1)) {
          curlyBracket = true;
        } else if (inverseSlash) {
          inverseSlash = false;
        }
      }

      if (curlyBracket) {
        // In case of char !== 'Backspace'
        if (key !== 'Backspace' && newCaretPosition === null) {
            // Trying to find the right position to put the char
            if (!switchedP[0] && i >= caretPosition 
              && this._base[i] === '_' && this._mask[maskPosition] !== '_') {
              aux[i] = key;
              switchedP[0] = true;
            }

            // Trying to find the right position to put the caret
            if (i + 1 === aux.length) {
              newCaretPosition = caretPosition + 1;
            } else if (switchedP[0] && this._base[i + 1] === '_' && this._mask[maskPosition + 1] !== '_') {
              newCaretPosition = i + 1;
            }
            
        // In case of char === 'Backspace'
        } else if (caretPosition > 0 && i > 0 && newCaretPosition === null) {
          if (i === caretPosition) {
            this._handleBackspacing(value, caretPosition, i - 1, switchedP, aux, setValueAndCaret);
          }
        }

        if (find(this._curlyBracketsEnds, maskPosition - 1)) {
          curlyBracket = false;
        }
      }

      value += aux[i];
    }

    if (key === 'Backspace' && caretPosition === this._base.length) {
      this._handleBackspacing(value, caretPosition, this._base.length - 1, switchedP, aux, setValueAndCaret);
    }

    // It implies caretPosition === 0
    if (newCaretPosition === null) {
      newCaretPosition = 0;
    }

    if (this._regex.exec(value)) {
      this._displayValue = value;
      this._actualValue = value;
      done(value, newCaretPosition, true);
    }
  }

  // eslint-disable-next-line max-params
  private _handleBackspacing(value: string, caretPosition: number, beginPosition: number, switchedP: [boolean], aux: string[], done: (value: string, newCaretPosition: number) => void) {
    const maskPosition = this._getCurrentMaskPosition(beginPosition);
    let newCaretPosition = 0;
    for (let k = beginPosition; k >= 0; k--) {
      // Trying to find the right position to remove the char
      if (!switchedP[0] && this._base[k] === '_' && this._mask[maskPosition] !== '_') {
        const oldValue = value;
        value = oldValue.substring(0, k);
        value += this._base[k];
        value += oldValue.substring(k + 1);
        aux[k] = this._base[k];
      
        switchedP[0] = true;
        newCaretPosition = k;
      } else if (!switchedP[0] && k === 0) {
        newCaretPosition = caretPosition;
        break;
      }
    }

    done(value, newCaretPosition);
  }

  private _getCurrentMaskPosition(i: number) {
    let position = 0;
    for (let k = 0; k < this._curlyBracketsBegins.length; k++) {
      if (i + position >= this._curlyBracketsBegins[k]) {
          position += 1;
      }

      if (i + position >= this._curlyBracketsEnds[k]) {
          position += 1;
      }

      if (i + position >= this._inverseSlashPositions[k]) {
          position += 1;
      }
    }

    return i + position;
  }

  private _processMask(): void {
    const mask = this._mask;
    let maskRegExpString = '^';
    let baseString = '';
    let curlyBracket = false;
    let inverseSlash = false;
    const curlyBracketsBegins: number[] = [];
    const curlyBracketsEnds: number[] = [];
    const inverseSlashPositions: number[] = [];
    for (let i = 0; i < mask.length; i++) {
      if (!curlyBracket) {
        if (mask[i] === '\\' && !inverseSlash) {
          inverseSlash = true;
          inverseSlashPositions.push(i);
        } else if ((mask[i] === '{' && inverseSlash) || mask[i] !== '{') {
          maskRegExpString += mask[i];
          baseString += mask[i];
          inverseSlash = false;
        } else if (mask[i] === '{') {
          curlyBracket = true;
          curlyBracketsBegins.push(i);
        }

        continue;
      }

      if (mask[i] === '}') {
        curlyBracket = false;
        curlyBracketsEnds.push(i);
        continue;
      }

      switch (mask[i]) {
        case 'e':
        case 'A':
        case 'a':
        case 'd':
          baseString += '_';
          break;
        default:
          baseString += mask[i];
      }

      switch (mask[i]) {
        case 'e':
          maskRegExpString += '([a-zA-Z]|_)';
          break;
        case 'A':
          maskRegExpString += '([A-Z]|_)';
          break;
        case 'a':
          maskRegExpString += '([a-z]|_)';
          break;
        case 'd':
          maskRegExpString += '(\\d|_)';
          break;
        default:
          maskRegExpString += mask[i];
      }
    }

    if (curlyBracket) {
      throw new Error('Mask expression must have closing curly brackets!');
    }

    maskRegExpString += '$';
    
    this._base = baseString;
    this._regex = new RegExp(maskRegExpString);
    this._curlyBracketsBegins = curlyBracketsBegins;
    this._curlyBracketsEnds = curlyBracketsEnds;
    this._inverseSlashPositions = inverseSlashPositions;

    this._actualValue = baseString;
    this._displayValue = baseString;
  }
}

interface MaskedTextfieldRef {
  masking: Masking;
}

export interface MaskedTextfieldProps extends TextfieldProps {
  mask: string;
}

const MaskedTextfieldBehavior: AquinoBehavior<MaskedTextfieldProps, typeof TextfieldTemplate, MaskedTextfieldRef> = props => {
  const {mask, innerRef, ...behaviorProps} = props;
  
  const masking = useNew(Masking, [mask]);
  const [superRef, setSuperRef] = useExtendsComponentRef<typeof MaskedTextfieldBehavior, typeof TextfieldBehavior>(innerRef, {masking});

  const handleMasking = useCallback((e: React.KeyboardEvent) => {
    if (!superRef) return;
    const {el} = superRef;
    if (el.selectionStart === null) return;
    masking.update(e.key, el.selectionStart, (displayValue, caretPosition, accepted) => {
      if (!accepted) {
        el.value = displayValue;
        return;
      }

      e.preventDefault();
      el.value = displayValue;
      el.setSelectionRange(caretPosition, caretPosition);
      el.focus();
    });
  }, [superRef]);

  useEffect(() => {
    if (!superRef) return;
    const {el, eventListeners} = superRef;

    el.value = masking.getDisplayValue();
    el.maxLength = el.value.length;

    eventListeners.add(AquinoEvents.KEYDOWN, handleMasking);
    masking.onExternalValueUpdate(displayValue => {
      el.value = displayValue;
    });
  }, [superRef]);

  return <TextfieldBehavior innerRef={setSuperRef} {...behaviorProps} />;
};

export default MaskedTextfieldBehavior;
