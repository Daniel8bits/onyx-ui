import React from 'react';
import {type ModalProps} from './Modal';
import {useRoot} from '@internals/Root';
import useModalRoot from '@hooks/useModalRoot';

export interface ModalTemplateProps extends ModalProps {
  open: boolean;
  modalRef: ReactElementRef<HTMLDivElement>;
}

const ModalTemplate: React.FC<ModalTemplateProps> = props => {
  const {render} = useModalRoot(props.id);

  return render(
    <div className={`ui-modal ${props.template ?? ''} ${props.open ? 'open' : ''} ${props.className ?? ''}`}>
      <div ref={props.modalRef}>
        {props.children}
      </div>
    </div>,
  );
};

export default ModalTemplate;
