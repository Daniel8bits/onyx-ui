import {useCallback, useState} from 'react';

function useUpdater(): [boolean, () => void] {
  const [updater, setUpdater] = useState<boolean>(false);
  const update = useCallback(() => {
    setUpdater(v => !v);
  }, []);
  return [updater, update];
}

export default useUpdater;
