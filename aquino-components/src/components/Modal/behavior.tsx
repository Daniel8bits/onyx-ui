import {useCallback, useEffect} from 'react';
import {useModalStore} from '@store/store';
import {type ModalProps} from './template';
import type ModalTemplate from './template';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import behavior, {type B} from '@internals/behavior';

export const {Behavior, useBehavior} = behavior<ModalProps, typeof ModalTemplate>(props => {
  const {innerRef, ...templateProps} = props;

  const {data, create, destroy, close} = useModalStore();

  const currentOpenValue = ((): boolean => {
    const modal = data.filter(m => m[0] === props.id)[0];
    return (modal ? modal[1].open : false);
  })();

  const {
    ref, 
    events: {
      onClick, 
      ...anotherEvents
    },
  } = useCreateComponentRef<B<ModalProps, typeof ModalTemplate>>(innerRef);

  useEffect(() => {
    if (props.id) {
      create({id: props.id, open: currentOpenValue, params: props.params});

        return () => {
          if (props.id) {
          destroy({id: props.id});
        }
      };
    }

    return undefined;
  }, []);

  const handleClose = useCallback(() => {
    if (!props.id) return;
    close({id: props.id});
  }, []);

  const isolatedOnClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e);
  }, [onClick]);

  return {
    el: ref,
    events: anotherEvents,
    open: currentOpenValue,
    onClickOnBackdrop: handleClose,
    isolatedOnClick,
    ...templateProps,
  };
});

export default Behavior;
