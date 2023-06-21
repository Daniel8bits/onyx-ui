import {useCallback, useEffect} from 'react';
import {type MaskedTextfieldRef, type MaskedTextfieldProps, maskingRefFactory} from '../MaskedTextfield/behavior';
import type TextfieldTemplate from '../Textfield/template';
import useExtendsComponentRef from '@hooks/useExtendsComponentRef';
import useNew from '@hooks/useNew';
import NumericMasking from '../common/NumericMasking';
import TextfieldBehavior from '../Textfield/behavior';
import {AquinoEvents} from '@internals/EventManager';
import extendedBehavior, {type B} from '@internals/extendedBehavior';

export interface NumericTextfieldRef extends MaskedTextfieldRef {
}

export interface NumericTextfieldProps extends Omit<MaskedTextfieldProps, 'mask'> {
  max?: number;
  min?: number;
}

export const {Behavior, useBehavior} = extendedBehavior<
  NumericTextfieldProps, 
  typeof TextfieldTemplate, 
  NumericTextfieldRef,
  typeof TextfieldBehavior
>(TextfieldBehavior, props => {
  const {max, min, innerRef, ...behaviorProps} = props;

  const masking = useNew(NumericMasking, [max, min]);

  const {attributes, superRef, setSuperRef} = useExtendsComponentRef<
    B<NumericTextfieldProps, typeof TextfieldTemplate, NumericTextfieldRef>,
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

  return {
    innerRef: setSuperRef,
    ...behaviorProps,
  };
});

export default Behavior;
