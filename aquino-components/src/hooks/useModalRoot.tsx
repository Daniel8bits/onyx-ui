import {useRoot} from '@internals/Root';
import {useEffect} from 'react';

function useModalRoot(id: string, open: boolean) {
  const {modalRoot} = useRoot();

  useEffect(() => modalRoot?.update());

  return {render: (modal: React.ReactNode) => modalRoot?.render(id, open, modal) ?? null};
}

export default useModalRoot;
