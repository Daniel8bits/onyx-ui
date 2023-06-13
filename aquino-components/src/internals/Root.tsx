
import useEventManager from '@hooks/useEventManager';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {type ComponentRefObject} from './ComponentRef';
import ModalRoot, {type ModalRootRef} from './ModalRoot';
import {generate} from './AquinoStyles';

const RootContext = React.createContext<Partial<{
  root: Omit<ComponentRefObject, 'super'>;
  modalRoot: ModalRootRef;
}>>({});

export function useRoot() {
  return useContext(RootContext);
}

export interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = props => {
  const [rootRef, setRootRef] = useState<Omit<ComponentRefObject<HTMLDivElement>, 'super'>>();
  const [modalRootRef, setModalRootRef] = useState<ModalRootRef>();
  const ref = useRef<HTMLDivElement>(null);

  const {eventManager, events} = useEventManager();

  useEffect(() => {
    if (!ref.current) return;
    setRootRef({el: ref.current, eventListeners: eventManager});
    generate();
  }, []);

  return (
    <RootContext.Provider value={{root: rootRef, modalRoot: modalRootRef}}>
      <div 
        ref={ref} 
        className='aquino-root'
        style={{
          minWidth: `${window.innerWidth}px`,
          minHeight: `${window.innerHeight}px`,
        }}
        {...events}
      >
        <div style={{minWidth: 'inherit', minHeight: 'inherit', overflow: 'auto'}}> 
          {props.children} 
        </div>
        <ModalRoot innerRef={setModalRootRef} />
      </div>
    </RootContext.Provider>
  );
};

export default Root;
