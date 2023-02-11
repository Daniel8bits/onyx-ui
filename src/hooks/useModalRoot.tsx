import {useRoot} from '@internals/Root';
import {useEffect} from 'react';

function useModalRoot(id: string) {
  const {modalRoot} = useRoot();

  useEffect(() => modalRoot?.update(id));

  return {render: (modal: React.ReactNode) => modalRoot?.render(id, modal)};
}

export default useModalRoot;
