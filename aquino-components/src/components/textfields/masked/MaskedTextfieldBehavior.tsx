/* eslint-disable react/prop-types */

import React, {useCallback, useEffect, useMemo} from 'react';
import type TextfieldTemplate from '@components/textfields/standard/TextfieldTemplate';
import {type TextfieldProps} from '@components/textfields/standard/TextfieldTemplate';
import {type AquinoBehavior} from '@internals/ThemeManager';
import TextfieldBehavior from '@components/textfields/standard/TextfieldBehavior';
import type EventManager from '@internals/EventManager';
import {AquinoEvents} from '@internals/EventManager';
import useNew from '@hooks/useNew';
import useExtendsComponentRef from '@hooks/useExtendsComponentRef';
import PatternMasking from './masking/PatternMasking';
import type Masking from './masking/Masking';
import NumericMasking from './masking/NumericMasking';

/*

TODO:
  * Passar o algoritmo de mascara para a classe [OK]
  * A classe deve ser extesível para outros tipos de mascarágem
  * Deve funcionar bem tanto com typing quanto com inserção de valor por ref
  * Deve ser autofixável
  * Deve funcionar para qualquer elemento

*/

export interface MaskedTextfieldRef {
  masking: Masking;
  update: (value: string, caretBeginPosition: number) => void;
  onUpdate: (event: React.KeyboardEvent, displayValue: string, caretPosition: number, accepted: boolean, reject: () => void) => void;
}

export function maskingRefFactory(superRef: {el: HTMLInputElement; eventListeners: EventManager}, masking: Masking): MaskedTextfieldRef {
  return {
    masking,
    update(value, caretBeginPosition) {
      const fn = (dv: string) => {
        superRef.el.value = dv;
      };

      value.split('').forEach((v, i) => masking.update(v, caretBeginPosition + i, fn));
    },
    onUpdate(event, displayValue, caretPosition, accepted) {
      if (!accepted) {
        superRef.el.value = displayValue;
        return;
      }

      event.preventDefault();
      superRef.el.value = displayValue;
      superRef.el.setSelectionRange(caretPosition, caretPosition);
      superRef.el.focus();
    },
  };
}

export interface MaskedTextfieldProps extends TextfieldProps {
  mask: string;
}

const MaskedTextfieldBehavior: AquinoBehavior<MaskedTextfieldProps, typeof TextfieldTemplate, MaskedTextfieldRef> = props => {
  const {mask, innerRef, ...behaviorProps} = props;
  
  const masking = useNew(PatternMasking, [mask]);

  const {attributes, superRef, setSuperRef} = useExtendsComponentRef<
    typeof MaskedTextfieldBehavior, 
    typeof TextfieldBehavior
  >(innerRef, superRef => ({
    attributes: maskingRefFactory(superRef, masking),
  }));
  
  const handleMasking = useCallback((e: React.KeyboardEvent) => {
    if (!superRef) return;
    const {el} = superRef;
    if (el.selectionStart === null) return;
    masking.update(e.key, el.selectionStart, (displayValue, caretPosition, accepted, reject) => {
      attributes?.onUpdate(e, displayValue, caretPosition, accepted, reject);
    });
  }, [superRef, attributes]);

  useEffect(() => {
    if (!superRef) return;
    const {el, eventListeners} = superRef;

    el.value = masking.getDisplayValue();
    el.maxLength = el.value.length;

    eventListeners.add(0, AquinoEvents.KEYDOWN, handleMasking);
  }, [superRef, attributes]);

  return <TextfieldBehavior innerRef={setSuperRef} {...behaviorProps} />;
};

export default MaskedTextfieldBehavior;
