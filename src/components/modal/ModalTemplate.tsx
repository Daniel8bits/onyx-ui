import React from 'react';
import {type ModalProps} from './Modal';

export interface ModalTemplateProps extends ModalProps {
  modalRef: ReactComponentRef<HTMLDivElement>;
}

const ModalTemplate: React.FC<ModalTemplateProps> = props => (
  <div className={`ui-modal ${props.template ?? ''} ${props.open ? 'open' : ''} ${props.className ?? ''}`}>
      <div ref={props.modalRef}>
          {props.children}
      </div>
  </div>
);

export default ModalTemplate;
