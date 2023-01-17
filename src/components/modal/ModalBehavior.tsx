import React, {useCallback, useEffect, useRef} from 'react';
import {useModalStore} from '@store/store';
import onClickOutside, {type OnClickOutsideCallbackRefObject} from '@utils/onClickOutside';
import {type ModalProps} from './Modal';
import {type ModalTemplateProps} from './ModalTemplate';

interface ModalBehaviorProps<T extends AnyObject = AnyObject> extends ModalProps<T> {
  Template: React.FC<ModalTemplateProps>;
}

function ModalBehavior<T extends AnyObject = AnyObject>(props: ModalBehaviorProps<T>) {
  const {Template, open, ...templateProps} = props;

  const {data, create, destroy, close} = useModalStore();

  const currentOpenValue = ((): boolean => {
    if (props.id) {
      const modal = data.filter(m => m[0] === props.id)[0];
      return (modal ? modal[1].open : false);
    }

    return open ?? false;
  })();

  const modalRef = useRef<HTMLDivElement>(null);
  const event = useRef<(e: MouseEvent) => void>(null);

  useEffect(() => {
    if (props.id) {
      create(props.id, open ?? false, props.params);

        return () => {
          if (props.id) {
          destroy(props.id);
        }
      };
    }

    return undefined;
  }, []);

  const handleClose = useCallback(() => {
    if (props.id) {
      close(props.id);
    }
  }, []);

  useEffect(() => {
    if (props.id && currentOpenValue && modalRef.current && !props.disableClickOutside) {
      const e = event as OnClickOutsideCallbackRefObject;

      if (event.current) {
        document.removeEventListener('click', event.current);
        e.current = null;
      }

      e.current = onClickOutside(modalRef.current, handleClose);
    }
  }, [props.id, currentOpenValue, props.disableClickOutside]);

  return <Template modalRef={modalRef} open={currentOpenValue} {...templateProps} />;
}

export default ModalBehavior;
