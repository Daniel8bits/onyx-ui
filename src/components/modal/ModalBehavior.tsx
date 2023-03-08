import React, {useCallback, useEffect, useRef} from 'react';
import {useModalStore} from '@store/store';
import {type ModalProps} from './Modal';
import {type ModalTemplateProps} from './ModalTemplate';
import useClickOutside from '@hooks/useClickOutside';

interface ModalBehaviorProps<T extends AnyObject = AnyObject> extends ModalProps<T> {
  Template: React.FC<ModalTemplateProps>;
}

function ModalBehavior<T extends AnyObject = AnyObject>(props: ModalBehaviorProps<T>) {
  const {Template, ...templateProps} = props;

  const {data, create, destroy, close} = useModalStore();

  const currentOpenValue = ((): boolean => {
    const modal = data.filter(m => m[0] === props.id)[0];
    return (modal ? modal[1].open : false);
  })();

  const modalRef = useRef<HTMLDivElement>(null);
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
    if (props.id && currentOpenValue && modalRef.current && !props.disableClickOutside) {
      removeClickOutside();
      onClickOutside(modalRef.current, handleClose);
    }
  }, [props.id, currentOpenValue, props.disableClickOutside]);

  return <Template modalRef={modalRef} open={currentOpenValue} {...templateProps} />;
}

export default ModalBehavior;
