
import useEventManager from '@hooks/useEventManager';
import React, {useContext, useEffect, useRef, useState} from 'react';
import type ComponentRef from './ComponentRef';
import ModalRoot, {type ModalRootRef} from './ModalRoot';

const RootContext = React.createContext<Partial<{
  root: ComponentRef;
  modalRoot: ModalRootRef;
}>>({});

export function useRoot() {
  return useContext(RootContext);
}

export interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = props => {
  const [rootRef, setRootRef] = useState<ComponentRef>();
  const modalRootRef = useRef<ModalRootRef>();
  const ref = useRef<HTMLDivElement>(null);

  const {eventManager, events} = useEventManager();

  useEffect(() => {
    if (!ref.current) return;
    setRootRef({el: ref.current, eventListeners: eventManager});
  }, []);

  return (
    <RootContext.Provider value={{root: rootRef, modalRoot: modalRootRef.current}}>
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
        <ModalRoot innerRef={modalRootRef} />
      </div>
    </RootContext.Provider>
  );
};

export default Root;
