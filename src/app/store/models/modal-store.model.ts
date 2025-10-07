export interface ModalState<Component> {
  openModalCallback?: (
    loadComponent: () => Promise<new () => Component>,
    inputs?: Record<string, unknown>
  ) => Promise<void>;
  closeModalCallback?: () => void;
}
