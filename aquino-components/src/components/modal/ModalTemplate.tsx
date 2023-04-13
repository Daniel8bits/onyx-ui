import React from 'react';
import useModalRoot from '@hooks/useModalRoot';
import {type Theme} from '@internals/ThemeManager';
import template from '@internals/template';

export interface ModalProps<T extends AnyObject = AnyObject> {
  readonly id: string;
  template?: string;
  className?: string;
  children?: any;
  params?: T;
  disableClickOutside?: boolean;
}

export interface ModalTemplateProps extends ModalProps {
  open: boolean;
}

const initialStyleValue = {
	div: ['', {
    div: '',
  }],
} satisfies Theme;

export type ModalTemplateStyle = typeof initialStyleValue;

const ModalTemplate = template<ModalTemplateProps, HTMLDivElement, ModalTemplateStyle>((props, style) => {
  const {render} = useModalRoot(props.id);

  return render(
    <div className={`${style?.div[0] ?? ''} ${props.className ?? ''}`} {...props.events}>
      <div ref={props.el} className={style?.div[1].div}>
        {props.children}
      </div>
    </div>,
  );
}, initialStyleValue);

export default ModalTemplate;
