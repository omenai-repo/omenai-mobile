import { create } from "zustand";

type ModalStoreTypes = {
    modalMessage: string | null,
    setModalMessage: (e: string | null) => void
};

export const useModalStore = create<ModalStoreTypes>(
    (set, get) => ({
        modalMessage: null,
        setModalMessage: (e: string | null) => {
            set({modalMessage: e})
        }
    })
)