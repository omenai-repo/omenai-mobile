import { create } from "zustand";

export type modalType = "error" | "success" | "input"

type updateModalProps = {
    message: string,
    showModal: boolean,
    modalType: modalType
}

type ModalStoreTypes = {
    showModal: boolean,
    modalMessage: string,
    setModalMessage: (e: string) => void,
    modalType: modalType,
    updateModal: (e: updateModalProps) => void
};

export const useModalStore = create<ModalStoreTypes>(
    (set, get) => ({
        showModal: false,
        modalMessage: "",
        setModalMessage: (e: string) => {
            set({modalMessage: e})
        },
        modalType: "error",
        updateModal: (e: updateModalProps) => {
            set({showModal: e.showModal, modalMessage: e.message, modalType: e.modalType})
        }
    })
)