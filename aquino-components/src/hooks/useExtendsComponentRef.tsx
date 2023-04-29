import {type AquinoBehavior, type AquinoComponent} from '@internals/ThemeManager';
import useComponentRef from '@hooks/useComponentRef';
import {useCallback, useEffect, useRef, useState} from 'react';
import {type ComponentRefObject} from '@internals/ComponentRef';
import {type SuperSetter, type RefAttributes} from './useCreateComponentRef';

type ForwardRefType<T extends AquinoBehavior<any, any> | AquinoComponent<any>> = 
  StateSetter<ComponentRefType<T>> | undefined;

type WithoutSuper<T> = Omit<T, 'super'>;

export type RefAttrSetterAndOverrider<
  T extends AquinoBehavior<any, any> | AquinoComponent<any>,
  E extends AquinoBehavior<any, any> | AquinoComponent<any>,
> = (superRef: WithoutSuper<NonNullable<ComponentRefType<E>>>) => {
  attributes: RefAttributes2<T, E>;
  override?: Partial<RefAttributes<E>>;
};

export type RefOverrider<
  E extends AquinoBehavior<any, any> | AquinoComponent<any>,
> = (superRef: WithoutSuper<NonNullable<ComponentRefType<E>>>) => {
  override: Partial<RefAttributes<E>>;
};

export type RefAttributes2<
  T extends AquinoBehavior<any, any> | AquinoComponent<any>,
  E extends AquinoBehavior<any, any> | AquinoComponent<any>,
> = Omit<NonNullable<ComponentRefType<T>>, keyof NonNullable<ComponentRefType<E>>>;

function useExtendsComponentRef<
  T extends AquinoBehavior<any, any> | AquinoComponent<any>,
  E extends AquinoBehavior<any, any> | AquinoComponent<any>,
>(
  ...args: ComponentRefObject extends RefAttributes2<T, E> 
    ? [ForwardRefType<T>, RefOverrider<E> | undefined]
    : [ForwardRefType<T>, RefAttrSetterAndOverrider<T, E>]
): {
  attributes: RefAttributes2<T, E> | undefined;
  superRef: ComponentRefType<E> | undefined; 
  setSuperRef: StateSetter<ComponentRefType<E> | undefined>;
} {
  const [forwardRef, getAttributes] = args;
  const [superRef, setSuperRef] = useComponentRef<E>();
  const [attributes, setAttributes] = useState<RefAttributes2<T, E>>();
  const isOverrided = useRef<boolean>(false);
  
  useEffect(() => {
    if (!superRef) return;
    if (isOverrided.current) return;

    const attr: {
      attributes?: RefAttributes2<T, E>;
      override?: Partial<RefAttributes<E>>;
    } = getAttributes ? getAttributes(superRef) : {attributes: undefined, override: undefined};
    setSuperRef(state => ({...(state ?? {}), ...(attr.override ?? {})}) as ComponentRefType<E>);
    setAttributes({...(attr.attributes ?? {})} as RefAttributes2<T, E>);

    const super_: SuperSetter<T> = attr => {
      setAttributes(state => state === undefined ? undefined : {...state, ...attr});
    };

    forwardRef?.({
      ...superRef,
      ...(attr.override ?? {}),
      ...(attr.attributes ?? {}),
      super: super_,
    } as ComponentRefType<T>);

    if (attr.override) {
      ((superRef as unknown as ComponentRefObject).super as SuperSetter<E>)(
        attr.override,
      );
    }

    isOverrided.current = true;
  }, [superRef]);

  /* .

  const updateState = useCallback<(
    ref: React.RefObject<ElType<T>>,
    eventManager: EventManager,
    attr: Attributes2<T, E>,
  ) => void>(() => {
    setThisRef({...(getAttributes({} as Attributes2<T, E>, {...superRef}))});
  }, []);

  useEffect(() => {
    if (!superRef) return;
    if (typeof getAttributes === 'function') {
      updateState({current: superRef.el}, superRef.eventListeners, )
    } else {
      setThisRef?.({...superRef});
    }
  }, [superRef]);
  */

  return {attributes, superRef, setSuperRef};
}

export default useExtendsComponentRef;
