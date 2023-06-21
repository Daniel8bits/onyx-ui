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
  onClickOnBackdrop: () => void;
  isolatedOnClick: (e: React.MouseEvent) => void;
}

const initialStyleValue = {
	backdrop: ['', {
    modal: '',
  }],
} satisfies Theme;

export type ModalTemplateStyle = typeof initialStyleValue;

export default template<
  ModalTemplateProps, 
  HTMLDivElement, 
  ModalTemplateStyle
>({
  name: 'modal',
  jsx(props, data) {
    const {theme, dataAquino} = data;
    const {render} = useModalRoot(props.id, props.open);

    return render(
      <div 
        data-aquino={dataAquino}
        className={`${theme?.backdrop[0] ?? ''}`} 
        role='backdrop'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: props.open ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={props.onClickOnBackdrop}
      >
        <div 
          ref={props.el} 
          className={`${theme?.backdrop[1].modal ?? ''} ${props.className ?? ''}`} 
          {...props.events}
          onClick={props.isolatedOnClick}
        >
          {props.children}
        </div>
      </div>,
    );
  }, 
  theme: initialStyleValue,
});
