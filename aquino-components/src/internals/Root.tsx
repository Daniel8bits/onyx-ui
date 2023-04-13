
import useEventManager from '@hooks/useEventManager';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {type ComponentRefObject} from './ComponentRef';
import ModalRoot, {type ModalRootRef} from './ModalRoot';
import useComponentRef from '@hooks/useComponentRef';

function insertGlobalStyle() {
  const id = 'aquino-global-style';
  if (document.getElementById(id)) return;
  const styleElement = document.createElement('style');
  styleElement.id = id;
  styleElement.innerText = `
    * {
      padding: 0;
      margin: 0;
    }
  `;
  document.head.append(styleElement);
}

const RootContext = React.createContext<Partial<{
  root: ComponentRefObject;
  modalRoot: ModalRootRef;
}>>({});

export function useRoot() {
  return useContext(RootContext);
}

export interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = props => {
  const [rootRef, setRootRef] = useState<ComponentRefObject<HTMLDivElement>>();
  const [modalRootRef, setModalRootRef] = useState<ModalRootRef>();
  const ref = useRef<HTMLDivElement>(null);

  const {eventManager, events} = useEventManager();

  useEffect(() => {
    if (!ref.current) return;
    setRootRef({el: ref.current, eventListeners: eventManager});
    insertGlobalStyle();
  }, []);

  return (
    <RootContext.Provider value={{root: rootRef, modalRoot: modalRootRef}}>
      <div 
        ref={ref} 
        className='aquino-root'
        style={{
          minWidth: `${window.innerWidth}px`,
          minHeight: `${window.innerHeight}px`,
          overflow: 'auto',
        }}
        {...events}
      >
        <div> {props.children} </div>
        <ModalRoot innerRef={setModalRootRef} />
      </div>
    </RootContext.Provider>
  );
};

export default Root;
