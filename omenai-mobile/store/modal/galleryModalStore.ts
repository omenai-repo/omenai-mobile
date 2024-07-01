import { create } from "zustand";

export type galleryOrderModalTypes = 'pending' | 'decline' | 'accept' | 'provideTrackingInfo'

type declineFormType = {reason: string}

type galleryModalStoreTypes = {
    isVisible: boolean,
    modalType: galleryOrderModalTypes,
    declineForm: declineFormType,
    updateDeclineForm: (label: string, value: string) => void,
    acceptForm: {
        carrier: string,
        fees: string,
        taxes: string,
        additional_info: string
    },
    trackingInfoForm: {
        tracking_id: string,
        tracking_link: string
    },
    clear: () => void,
    setIsVisible: (value: boolean) => void,
    setModalType: (modal: galleryOrderModalTypes) => void
};

export const galleryOrderModalStore = create<galleryModalStoreTypes>((set, get) => ({
    isVisible: false,
    modalType: "decline",
    declineForm: {
        reason: ''
    },
    acceptForm: {
        carrier: '',
        fees: '',
        taxes: '',
        additional_info: ''
    },
    trackingInfoForm: {
        tracking_id: '',
        tracking_link: ''
    },
    updateDeclineForm: (label: string, value: string) => {
        const data: Record<string, any> = get().declineForm;
  
        if (label in data) {
          const updatedData = { ...data, [label]: value };
  
          set({declineForm: updatedData as declineFormType});
        }
    },
    clear: () => {
        set({
            isVisible: false,
            modalType: 'accept',
            declineForm: {
                reason: ''
            },
            acceptForm: {
                carrier: '',
                fees: '',
                taxes: '',
                additional_info: ''
            },
            trackingInfoForm: {
                tracking_id: '',
                tracking_link: ''
            }
        })
    },
    setIsVisible: (value: boolean) => {
        set({isVisible: value})
    },
    setModalType: (modal: galleryOrderModalTypes) => {
        set({modalType: modal})
    }
}))