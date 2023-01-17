
import {create} from 'zustand';

export interface IComponentObject<T extends AnyObject = AnyObject> {
  id: string;
  open: boolean;
  params?: T;
}

interface IComponentStore {
  data: Array<[string, IComponentObject]>;
  create: (id: string, open: boolean, params?: AnyObject) => void;
  destroy: (id: string) => void;
  open: (id: string) => void;
  close: (id: string) => void;
  setOpen: (id: string, open: boolean) => void;
  setParams: (id: string, params?: AnyObject) => void;
}

type ZustandSetter<T> = (partial: IComponentStore | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void;

function createComponentStore(set: ZustandSetter<IComponentStore>): IComponentStore {
  return {
    data: [],
    create: (id, open, params) => set(state => {
      if (state.data.filter(m => m[0] === id).length > 0) return state;
      return {...state, data: [...state.data, [id, {id, open, params}]]};
    }),
    destroy: id => set(state => {
      const data = state.data.filter(m => m[0] !== id);
      return {...state, data};
    }),
    open: id => set(state => {
      const modal = state.data.filter(m => m[0] === id)[0];
      if (!modal) return state;
      const data = state.data.filter(m => m[0] !== id);
      modal[1].open = true;
      data.push(modal);
      return {...state, data};
    }),
    close: id => set(state => {
      const modal = state.data.filter(m => m[0] === id)[0];
      if (!modal) return state;
      const data = state.data.filter(m => m[0] !== id);
      modal[1].open = false;
      data.push(modal);
      return {...state, data};
    }),
    setOpen: (id, open) => set(state => {
      const modal = state.data.filter(m => m[0] === id)[0];
      if (!modal) return state;
      const data = state.data.filter(m => m[0] !== id);
      modal[1].open = open;
      data.push(modal);
      return {...state, data};
    }),
    setParams: (id, params) => set(state => {
      const modal = state.data.filter(m => m[0] === id)[0];
      if (!modal) return state;
      const data = state.data.filter(m => m[0] !== id);
      modal[1].params = params;
      data.push(modal);
      return {...state, data};
    }),
  };
}

export const useModalStore = create<IComponentStore>(createComponentStore);

export const usePopOverStore = create<IComponentStore>(createComponentStore);

export interface IUseComponentHookReturn<T extends AnyObject = AnyObject> {
  data: Nullable<IComponentObject<T>>;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
  setParams: (params: T) => void;
}
