import React, { ReactNode } from "react";
import { create } from "zustand";

export type modalType = "error" | "success" | "input"

type updateModalProps = {
    message: string,
    showModal: boolean,
    modalType: modalType | ""
}

type updateConfirmationModalProps = {
    child: ReactNode
}

type ModalStoreTypes = {
    showModal: boolean,
    showConfirmationModal: boolean,
    modalMessage: string,
    setModalMessage: (e: string) => void,
    modalType: modalType | "",
    updateModal: (e: updateModalProps) => void,
    webViewUrl: string | null,
    setWebViewUrl: (e: string | null) => void,
    updateConfirmationModal: (e: updateConfirmationModalProps) => void,
    confirmationModal: ReactNode,
    clear: () => void,
    retainModal: string | null,
    setRetainModal: (modalName: {retainModal: string | null, showModal: boolean, message?: string}) => void
};

export const useModalStore = create<ModalStoreTypes>(
    (set, get) => ({
        showConfirmationModal: false,
        showModal: false,
        modalMessage: "",
        setModalMessage: (e: string) => {
            set({modalMessage: e})
        },
        modalType: "",
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
        retainModal: null,
        setRetainModal: ({retainModal, showModal, message}: {retainModal: string | null, showModal: boolean, message?: string}) => {
            set({retainModal: retainModal, showModal: showModal, modalMessage: message})
        },
        clear: () => {
            set({
                showConfirmationModal: false,
                showModal: false,
                retainModal: null,
                modalMessage: "",
                webViewUrl: null
            })
        }
    })
)