/* eslint-disable react/prop-types */
import React, {useCallback, useEffect} from 'react';
import {useModalStore} from '@store/store';
import {type ModalProps, type ModalTemplateStyle} from './ModalTemplate';
import type ModalTemplate from './ModalTemplate';
import useClickOutside from '@hooks/useClickOutside';
import {type AquinoBehavior} from '@internals/ThemeManager';
import useCreateComponentRef from '@hooks/useCreateComponentRef';

const ModalBehavior: AquinoBehavior<ModalProps, typeof ModalTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;

  const {data, create, destroy, close} = useModalStore();

  const currentOpenValue = ((): boolean => {
    const modal = data.filter(m => m[0] === props.id)[0];
    return (modal ? modal[1].open : false);
  })();

  const {ref, events} = useCreateComponentRef<typeof ModalBehavior>(innerRef);
  const [onClickOutside, removeClickOutside] = useClickOutside();

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
    if (props.id) {
      close({id: props.id});
    }
  }, []);

  useEffect(() => {
    if (props.id && currentOpenValue && ref.current && !props.disableClickOutside) {
      removeClickOutside();
      onClickOutside(ref.current, handleClose);
    }
  }, [props.id, currentOpenValue, props.disableClickOutside]);

  return <Template el={ref} events={events} open={currentOpenValue} {...templateProps} />;
};

export default ModalBehavior;
