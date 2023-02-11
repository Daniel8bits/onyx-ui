import {usePopOverStore, type IUseComponentHookReturn} from '@store/store';

export function getPopOver<T extends AnyObject = AnyObject>(id: string) {
  const {data, open, close, setOpen, setParams} = usePopOverStore.getState();
  const popover = data.filter(m => m[0] === id)[0];

  return {
    data: popover ? popover[1] : null,
    open: () => open({id}),
    close: () => close({id}),
    setOpen: (open: boolean) => setOpen({id, open}),
    setParams: (params: T) => setParams({id, params}),
  } as IUseComponentHookReturn<T>;
}

function usePopOver<T extends AnyObject = AnyObject>(id: string) {
  const popover = usePopOverStore(state => state.data.filter(m => m[0] === id)[0]);
  const open = usePopOverStore(state => state.open);
  const close = usePopOverStore(state => state.close);
  const setOpen = usePopOverStore(state => state.setOpen);
  const setParams = usePopOverStore(state => state.setParams);

  return {
    data: popover ? popover[1] : null,
    open: () => open({id}),
    close: () => close({id}),
    setOpen: open => setOpen({id, open}),
    setParams: params => setParams({id, params}),
  } as IUseComponentHookReturn<T>;
}

export default usePopOver;
