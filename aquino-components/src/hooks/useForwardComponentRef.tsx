import type ComponentRef from '@internals/ComponentRef';
import {type ComponentRefObject} from '@internals/ComponentRef';
import {type AquinoBehavior, type AquinoComponent} from '@internals/ThemeManager';
import {useCallback, useEffect, useRef} from 'react';
import useComponentRef from '@hooks/useComponentRef';

function useForwardComponentRef<T extends AquinoBehavior<any, any> | AquinoComponent<any>>(
  forwardRef: ReturnType<(typeof useComponentRef<T>)>[1] | undefined,
  extension: Exclude<ReturnType<(typeof useComponentRef<T>)>[0], ComponentRef<any>>,
) {
  const [ref, setRef] = useComponentRef<T>();

	useEffect(() => {
    if (!(ref && forwardRef)) return;
    forwardRef(state => ({
      ...ref,
      ...(extension ?? {}),
    }) as ReturnType<(typeof useComponentRef<T>)>[0]);
	}, [ref]);

  const setRefWithWExtension = useCallback((arg: Parameters<typeof setRef>[0]) => {
    if (typeof arg === 'function') {
      return;
    }

    if (arg) {
      setRef({...(arg ?? {}), ...(extension ?? {})});
    }
  }, []);

  return [ref, setRef];
}

export default useForwardComponentRef;
