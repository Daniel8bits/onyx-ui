import useEventManager from '@hooks/useEventManager';
import useUpdater from '@hooks/useUpdater';
import React, {useEffect, useRef} from 'react';
import type OnyxComponentRef from './OnyxComponentRef';

export interface ModalRootRef extends OnyxComponentRef {
  render: (key: string, modal: React.ReactNode) => null;
  update: (key: string) => void;
}

interface ModalRootProps {
  innerRef: React.MutableRefObject<Nullable<OnyxComponentRef>>;
}

const ModalRoot: React.FC<ModalRootProps> = props => {
  const modalRootRef = useRef<ModalRootRef>();
  const modalsRef = useRef<Map<string, React.ReactNode>>(new Map());
  const ref = useRef<HTMLDivElement>(null);
  const update = useUpdater();

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
    props.innerRef.current = modalRootRef.current;
  }, []);

  return (
    <div role='modal container' ref={ref} {...events}>
      {[...modalsRef.current].map(child => <React.Fragment key={child[0]}>{child[1]}</React.Fragment>)}
    </div>
  );
};

export default ModalRoot;
