
import produce from 'immer';
import {create} from 'zustand';

export interface IComponentObject<T extends AnyObject = AnyObject> {
  id: string;
  open: boolean;
  params?: T;
}

interface IComponentStore {
  data: Array<[string, IComponentObject]>;
  create: (payload: {id: string; open: boolean; params?: AnyObject}) => void;
  destroy: (payload: {id: string}) => void;
  open: (payload: {id: string}) => void;
  close: (payload: {id: string}) => void;
  setOpen: (payload: {id: string; open: boolean}) => void;
  setParams: (payload: {id: string; params?: AnyObject}) => void;
}

type ZustandSetter<T> = (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void;

const action = <S, T>(set: ZustandSetter<S>, callback: (state: S, payload: T) => void) => (payload: T) => set(produce<S>(state => callback(state as S, payload)));

function createComponentStore(set: ZustandSetter<IComponentStore>): IComponentStore {
  return {
    data: [],
    create: action(set, (draft, payload) => {
      const {id, open, params} = payload;
      if (draft.data.filter(m => m[0] === id).length > 0) return draft;
      draft.data.push([id, {id, open, params}]);
    }),
    destroy: action(set, (draft, payload) => {
      draft.data = draft.data.filter(m => m[0] !== payload.id);
    }),
    open: action(set, (draft, payload) => {
      const component = draft.data.filter(m => m[0] === payload.id)[0];
      if (!component) return;
      component[1].open = true;
    }),
    close: action(set, (draft, payload) => {
      const component = draft.data.filter(m => m[0] === payload.id)[0];
      if (!component) return;
      component[1].open = false;
    }),
    setOpen: action(set, (draft, payload) => {
      const {id, open} = payload;
      const component = draft.data.filter(m => m[0] === id)[0];
      if (!component) return;
      component[1].open = open;
    }),
    setParams: action(set, (draft, payload) => {
      const {id, params} = payload;
      const component = draft.data.filter(m => m[0] === id)[0];
      if (!component) return;
      component[1].params = params;
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
