import {type AquinoBehavior, type AquinoComponent} from '@internals/ThemeManager';
import useComponentRef from '@hooks/useComponentRef';
import {useEffect} from 'react';

function useExtendsComponentRef<
  T extends AquinoBehavior<any, any> | AquinoComponent<any>,
  E extends AquinoBehavior<any, any> | AquinoComponent<any>,
>(
  forwardRef: StateSetter<ComponentRefType<T>> | undefined,
  attributes: Omit<NonNullable<ComponentRefType<T>>, keyof NonNullable<ComponentRefType<E>>>,
): [
  ComponentRefType<E> | undefined, 
  StateSetter<ComponentRefType<E> | undefined>,
] {
  const [superRef, setSuperRef] = useComponentRef<E>();

  useEffect(() => {
    if (!superRef) return;
    forwardRef?.({...superRef, ...(attributes ?? {})});
  }, [superRef]);

  return [superRef, setSuperRef];
}

export default useExtendsComponentRef;
