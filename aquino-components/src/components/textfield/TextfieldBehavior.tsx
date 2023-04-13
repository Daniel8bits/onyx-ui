/* eslint-disable react/prop-types */
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {type TextfieldProps, type TextfieldTemplateStyle} from './TextfieldTemplate';
import type TextfieldTemplate from './TextfieldTemplate';
import {type AquinoBehavior} from '@internals/ThemeManager';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import useUniqueId from '@hooks/useUniqueId';

const TextfieldBehavior: AquinoBehavior<TextfieldProps, typeof TextfieldTemplate> = props => {
  const {Template, innerRef, id, ...templateProps} = props;
  
  const {ref, events} = useCreateComponentRef<typeof TextfieldBehavior>(innerRef);
  const uniqueId = useUniqueId(id, true);

  useEffect(() => {
    if (!ref.current) return;
    props.onLoad?.(ref);
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

    if (props.onAction && ref.current) {
      props.onAction(ref.current.value);
    }
  }, [props.disabled, props.onKeyUp, props.onAction]);

  const inputProps = useMemo<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>(() => ({
    id: uniqueId(),
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

  return <Template el={ref} events={events} inputProps={inputProps} {...templateProps} />;
};

export default TextfieldBehavior;
