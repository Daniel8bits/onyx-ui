import {useCallback, useEffect, useMemo, useRef} from 'react';
import {type TextfieldProps} from './template';
import type TextfieldTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import useUniqueId from '@hooks/useUniqueId';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<TextfieldProps, typeof TextfieldTemplate>(props => {
  const {innerRef, id, ...templateProps} = props;
  
  const {ref, events} = useCreateComponentRef<B<TextfieldProps, typeof TextfieldTemplate>>(innerRef);
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

  return {
    el: ref,
    events,
    inputProps,
    ...templateProps,
  };
});

export default Behavior;
