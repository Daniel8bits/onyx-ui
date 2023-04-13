import {useMemo} from 'react';
import uniqid from 'uniqid';

function useUniqueId(id?: string, exact?: boolean) {
  const counter = {n: 0};
  const uniqueId = useMemo<string>(() => id ?? uniqid('__AQUINO__'), [id]);

  return () => exact ? uniqueId : `${uniqueId}_${counter.n++}`;
}

export default useUniqueId;
