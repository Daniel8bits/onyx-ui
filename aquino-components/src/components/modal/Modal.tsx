import React from 'react';
import ModalTemplate, {type ModalProps, type ModalTemplateProps, type ModalTemplateStyle} from './ModalTemplate';
import ModalBehavior from './ModalBehavior';
import {type AquinoComponent} from '@internals/ThemeManager';

const Modal: AquinoComponent<ModalProps, ModalTemplateStyle, ModalTemplateProps> = props => <ModalBehavior Template={ModalTemplate} {...props} />;

export default Modal;
