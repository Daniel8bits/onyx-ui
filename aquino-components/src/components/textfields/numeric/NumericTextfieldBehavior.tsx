/* eslint-disable react/prop-types */
import React, {useCallback, useEffect} from 'react';
import {type AquinoBehavior} from '@internals/ThemeManager';
import MaskedTextfieldBehavior, {type MaskedTextfieldRef, type MaskedTextfieldProps, maskingRefFactory} from '../masked/MaskedTextfieldBehavior';
import type TextfieldTemplate from '../standard/TextfieldTemplate';
import useExtendsComponentRef from '@hooks/useExtendsComponentRef';
import useNew from '@hooks/useNew';
import NumericMasking from '../masked/masking/NumericMasking';
import TextfieldBehavior from '../standard/TextfieldBehavior';
import {AquinoEvents} from '@internals/EventManager';

export interface NumericTextfieldRef extends MaskedTextfieldRef {
}

interface NumericTextfieldProps extends Omit<MaskedTextfieldProps, 'mask'> {
  max?: number;
  min?: number;
}

/* . 
attributes: {
        ...maskingRef,
        onUpdate(event, displayValue, caretPosition, accepted, reject) {
          if (displayValue === '-') {
            if (props.min !== undefined && props.min < 0) {
              maskingRef.onUpdate(event, displayValue, caretPosition, accepted, reject);
            } else if (props.min !== undefined) {
              reject();
            }

            return;
          }

          const lessThanMin = props.min === undefined ? false : Number(displayValue) < props.min;
          const moreThanMax = props.max === undefined ? false : Number(displayValue) > props.max;
          if (lessThanMin || moreThanMax) {
            reject();
            return;
          }
          
          maskingRef.onUpdate(event, displayValue, caretPosition, accepted, reject);
        },
      },

*/

const NumericTextfieldBehavior: AquinoBehavior<NumericTextfieldProps, typeof TextfieldTemplate, NumericTextfieldRef> = props => {
  const {max, min, innerRef, ...behaviorProps} = props;

  const masking = useNew(NumericMasking, [max, min]);

  const {attributes, superRef, setSuperRef} = useExtendsComponentRef<
    typeof NumericTextfieldBehavior,
    typeof TextfieldBehavior
  >(innerRef, superRef => {
    const maskingRef = maskingRefFactory(superRef, masking);
    return {
      attributes: {...maskingRef},
    };
  });

  useEffect(() => {
    masking.setMax(max);
    masking.setMin(min);
  }, [max, min]);

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

/* .

const superOnUpdate = superRef.onUpdate;
    return {
      
      onUpdate(event, displayValue, caretPosition, accepted) {
        const lessThanMin = props.min === undefined ? false : Number(displayValue) < props.min;
        const moreThanMax = props.max === undefined ? false : Number(displayValue) > props.max;
        if (lessThanMin || moreThanMax) return;
        superOnUpdate(event, displayValue, caretPosition, accepted);
      },
    };

*/

export default NumericTextfieldBehavior;
