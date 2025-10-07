import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ModalState } from './models/modal-store.model';

const initialState: ModalState<unknown> = {
  openModalCallback: undefined,
  closeModalCallback: undefined,
};

export const ModalStore = signalStore(
  { providedIn: 'root' },
  withState(() => initialState),
  withMethods((store) => ({
    setModalCallback(
      openModalCallback?: (
        loadComponent: () => Promise<new () => unknown>,
        inputs?: Record<string, unknown>
      ) => Promise<void>,
      closeModalCallback?: () => void
    ) {
      patchState(store, (state: ModalState<unknown>) => ({
        ...state,
        openModalCallback,
        closeModalCallback,
      }));
    },
    openModal<Component>(
      loadComponent: () => Promise<new () => Component>,
      inputs?: Record<string, unknown>
    ) {
      store.openModalCallback?.()?.(loadComponent, inputs);
    },
    closeModal() {
      store.closeModalCallback?.()?.();
    },
  }))
);
