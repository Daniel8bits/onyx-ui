/* eslint-disable react/prop-types */
import React, {useCallback, useEffect} from 'react';
import {useModalStore} from '@store/store';
import {type ModalProps} from './ModalTemplate';
import type ModalTemplate from './ModalTemplate';
import {type AquinoBehavior} from '@internals/ThemeManager';
import useCreateComponentRef from '@hooks/useCreateComponentRef';

const ModalBehavior: AquinoBehavior<ModalProps, typeof ModalTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;

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
  } = useCreateComponentRef<typeof ModalBehavior>(innerRef);

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
    console.log('handleClose::1');
    if (props.id) {
      console.log('handleClose::2');
      close({id: props.id});
    }
  }, []);

  const isolatedOnClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e);
  }, [onClick]);

  return (
    <Template 
      el={ref} 
      events={anotherEvents} 
      open={currentOpenValue} 
      onClickOnBackdrop={handleClose} 
      isolatedOnClick={isolatedOnClick}
      {...templateProps} 
    />
  );
};

export default ModalBehavior;
