import React from 'react';
import {type ModalProps} from './Modal';
import {useRoot} from '@internals/Root';

export interface ModalTemplateProps extends ModalProps {
  open: boolean;
  modalRef: ReactElementRef<HTMLDivElement>;
}

const ModalTemplate: React.FC<ModalTemplateProps> = props => {
  const {modalRoot} = useRoot();

  return modalRoot?.render(
    props.id,
    <div className={`ui-modal ${props.template ?? ''} ${props.open ? 'open' : ''} ${props.className ?? ''}`}>
      <div ref={props.modalRef}>
        {props.children}
      </div>
    </div>,
  ) ?? null;
};

export default ModalTemplate;
