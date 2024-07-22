import React, { ReactNode } from "react";
import { create } from "zustand";

export type modalType = "error" | "success" | "input"

type updateModalProps = {
    message: string,
    showModal: boolean,
    modalType: modalType
}

type updateConfirmationModalProps = {
    child: ReactNode
}

type ModalStoreTypes = {
    showModal: boolean,
    showConfirmationModal: boolean,
    modalMessage: string,
    setModalMessage: (e: string) => void,
    modalType: modalType,
    updateModal: (e: updateModalProps) => void,
    webViewUrl: string | null,
    setWebViewUrl: (e: string | null) => void,
    updateConfirmationModal: (e: updateConfirmationModalProps) => void,
    confirmationModal: ReactNode,
    clear: () => void
};

export const useModalStore = create<ModalStoreTypes>(
    (set, get) => ({
        showConfirmationModal: false,
        showModal: false,
        modalMessage: "",
        setModalMessage: (e: string) => {
            set({modalMessage: e})
        },
        modalType: "error",
        updateModal: (e: updateModalProps) => {
            set({showModal: e.showModal, modalMessage: e.message, modalType: e.modalType})
        },
        webViewUrl: null,
        setWebViewUrl: (e: string | null) => {
            set({webViewUrl: e})
        },
        confirmationModal: null,
        updateConfirmationModal: (e: updateConfirmationModalProps) => {
            set({confirmationModal: e.child, showConfirmationModal: true})
        },
        clear: () => {
            set({
                showConfirmationModal: false,
                showModal: false,
                modalMessage: "",
                webViewUrl: null
            })
        }
    })
)