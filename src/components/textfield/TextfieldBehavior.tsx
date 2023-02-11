import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import useNew from '@hooks/useNew';
import MaskedInput from 'react-text-mask';
import {type TextfieldProps} from './Textfield';
import TextfieldCore from './TextfieldCore';
import {type TextfieldTemplateProps} from './TextfieldTemplate';

interface TextfieldBehaviorProps extends TextfieldProps {
  Template: React.FC<TextfieldTemplateProps>;
}

const TextfieldBehavior: React.FC<TextfieldBehaviorProps> = props => {
  const {Template, ...templateProps} = props;
  
  const inputTextRef = useRef<HTMLInputElement>(null);
  const maskedInputRef = useRef<MaskedInput>(null);

  const core = useNew(TextfieldCore, [props.mask]);

  useEffect(() => {
    if (props.mask && !inputTextRef.current && maskedInputRef.current) {
      const inputRef = inputTextRef as React.MutableRefObject<HTMLInputElement>;
      inputRef.current = maskedInputRef.current.inputElement as HTMLInputElement;
    }

    if (inputTextRef.current) {
      if (props.innerRef) {
        (props.innerRef as React.MutableRefObject<HTMLInputElement>).current = inputTextRef.current;
      }

      props.onLoad?.(inputTextRef);
    }
  }, []);

  /**
   * UIInputText default action
   * Occurs when the user insert some text and the key is released
   * @param event 
   */
  const actionPerformed = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    if (props.onKeyUp) {
      props.onKeyUp(event);
    }

    if (props.onAction && inputTextRef.current) {
      props.onAction(inputTextRef.current.value);
    }
  }, [props.disabled, props.onKeyUp, props.onAction]);

  const inputProps = useMemo(() => ({
    id: props.id,
    name: props.id,
    type: props.password ? 'password' : 'text',
    placeholder: props.placeholder ?? '',
    disabled: props.disabled,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onKeyUp: actionPerformed,
    onKeyDown: props.onKeyDown,
    onChange: props.onChange,
    onMouseUp: props.onMouseUp,
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    'aria-label': props.ariaLabel ?? props.label ?? undefined,
  }), [
    props.id,
    props.password,
    props.placeholder,
    props.disabled,
    props.onFocus,
    props.onBlur,
    props.onKeyDown,
    props.onChange,
    props.onMouseUp,
    props.ariaLabel,
    props.label,
    actionPerformed,
  ]);

  const input = useMemo(() => {
    if (!core.decomposedMask) return <input type='text' />;
    return props.mask
      ? <MaskedInput ref={maskedInputRef} mask={core.decomposedMask} showMask {...inputProps} />
      : <input ref={inputTextRef} {...inputProps} />;
  }, [props.mask]);

  return <Template core={core} input={input} {...templateProps} />;
};

export default TextfieldBehavior;
