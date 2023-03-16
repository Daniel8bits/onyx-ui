import {type IUseComponentHookReturn, useModalStore} from '@store/store';

export function getModal<T extends AnyObject = AnyObject>(id: string) {
  const {data, open, close, setOpen, setParams} = useModalStore.getState();
  const modal = data.filter(m => m[0] === id)[0];

  return {
    data: modal ? modal[1] : null,
    open: () => open({id}),
    close: () => close({id}),
    setOpen: (open: boolean) => setOpen({id, open}),
    setParams: (params: T) => setParams({id, params}),
  } as IUseComponentHookReturn<T>;
}

function useModal<T extends AnyObject = AnyObject>(id: string) {
  const modal = useModalStore(state => state.data.filter(m => m[0] === id)[0]);
  const open = useModalStore(state => state.open);
  const close = useModalStore(state => state.close);
  const setOpen = useModalStore(state => state.setOpen);
  const setParams = useModalStore(state => state.setParams);

  return {
    data: modal ? modal[1] : null,
    open: () => open({id}),
    close: () => close({id}),
    setOpen: (open: boolean) => setOpen({id, open}),
    setParams: (params: T) => setParams({id, params}),
  } as IUseComponentHookReturn<T>;
}

export default useModal;
