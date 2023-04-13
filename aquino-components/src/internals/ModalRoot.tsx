import useEventManager from '@hooks/useEventManager';
import useUpdater from '@hooks/useUpdater';
import React, {useEffect, useRef, useState} from 'react';
import type ComponentRef from './ComponentRef';
import {type ComponentRefObject} from './ComponentRef';

export interface ModalRootRef extends ComponentRefObject<HTMLDivElement> {
  render: (key: string, modal: React.ReactNode) => null;
  update: (key: string) => void;
}

interface ModalRootProps {
  innerRef: ComponentRef<HTMLDivElement, ModalRootRef>;
}

const ModalRoot: React.FC<ModalRootProps> = props => {
  const modalRootRef = useRef<ModalRootRef>();
  const modalsRef = useRef<Map<string, React.ReactNode>>(new Map());
  const ref = useRef<HTMLDivElement>(null);
  const [, update] = useUpdater();

  const {eventManager, events} = useEventManager();

  useEffect(() => {
    if (!ref.current) return;
    modalRootRef.current = {
      el: ref.current, 
      eventListeners: eventManager,
      render(key, modal) {
        modalsRef.current.set(key, modal);
        return null;
      },
      update,
    };
    props.innerRef(modalRootRef.current);
  }, []);

  return (
    <div role='modal container' ref={ref} {...events}>
      {[...modalsRef.current].map(child => <React.Fragment key={child[0]}>{child[1]}</React.Fragment>)}
    </div>
  );
};

export default ModalRoot;
