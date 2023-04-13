import React from 'react';
import ModalTemplate from './ModalTemplate';
import ModalBehavior from './ModalBehavior';
import {type AquinoComponent} from '@internals/ThemeManager';

const Modal: AquinoComponent<typeof ModalBehavior> = props => <ModalBehavior Template={ModalTemplate} {...props} />;

export default Modal;
