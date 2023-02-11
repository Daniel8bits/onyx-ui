import {useModalStore, usePopOverStore} from '@store/store';

const initialPopOverState = usePopOverStore.getState();
const initialModalState = useModalStore.getState();

export function resetPopOverState() {
  beforeEach(() => {
    usePopOverStore.setState(initialPopOverState);
  });
}

export function resetModalState() {
  beforeEach(() => {
    useModalStore.setState(initialModalState);
  });
}

export function resetAll() {
  resetPopOverState();
  resetModalState();
}
