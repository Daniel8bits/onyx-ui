import { IComponentObject, IUseComponentHookReturn, useModalStore } from "@store/store"

export function getModal<T extends AnyObject>(id: string) {
  
  const {data, open, close, setOpen, setParams} = useModalStore.getState()
  const modal = data.filter(m => m[0] === id)[0]

  return {
    data: modal ? modal[1] : null,
    open: () => open(id),
    close: () => close(id),
    setOpen: (open: boolean) => setOpen(id, open),
    setParams: (params: T) => setParams(id, params)
  } as IUseComponentHookReturn<T>

}

function useModal<T extends AnyObject>(id: string) {

  const {data, open, close, setOpen, setParams} = useModalStore()
  const modal = data.filter(m => m[0] === id)[0]

  return {
    data: modal ? modal[1] : null,
    open: () => open(id),
    close: () => close(id),
    setOpen: (open: boolean) => setOpen(id, open),
    setParams: (params: T) => setParams(id, params)
  } as IUseComponentHookReturn<T>

}

export default useModal