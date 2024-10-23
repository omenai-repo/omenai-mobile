import { create } from "zustand";

export type galleryOrderModalTypes = 'details' | 'decline' | 'accept' | 'provideTrackingInfo' | 'deleteAccount'

type declineFormType = {reason: string}
type acceptFormType = {
    carrier: string,
    fees: string,
    taxes: string,
    additional_info: string
}
type trackingInfoFormType = {
    tracking_id: string,
    tracking_link: string
}

type orderDetailsType = {
    url: string,
    type: string,
    details: {label: string, value: string}[]
}

type galleryModalStoreTypes = {
    isVisible: boolean,
    modalType: galleryOrderModalTypes,
    declineForm: declineFormType,
    updateDeclineForm: (label: string, value: string) => void,
    acceptForm: acceptFormType,
    updateAcceptForm: (label: string, value: string) => void,
    trackingInfoForm: trackingInfoFormType,
    updateTrackingInfoForm: (label: string, value: string) => void,
    clear: () => void,
    setIsVisible: (value: boolean) => void,
    setModalType: (modal: galleryOrderModalTypes) => void,
    artworkDetails: null | orderDetailsType,
    setArtworkDetails: (e: null | orderDetailsType) => void,
    currentId: string,
    setCurrentId: (e: string) => void
};

export const galleryOrderModalStore = create<galleryModalStoreTypes>((set, get) => ({
    isVisible: false,
    setIsVisible: (value: boolean) => {
        set({isVisible: value})
    },
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
    updateAcceptForm: (label: string, value: string) => {
        const data: Record<string, any> = get().acceptForm;
  
        if (label in data) {
          const updatedData = { ...data, [label]: value };
  
          set({acceptForm: updatedData as acceptFormType});
        }
    },
    updateTrackingInfoForm: (label: string, value: string) => {
        const data: Record<string, any> = get().trackingInfoForm;
  
        if (label in data) {
          const updatedData = { ...data, [label]: value };
  
          set({trackingInfoForm: updatedData as trackingInfoFormType});
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
            },
            artworkDetails: null,
            currentId: ''
        })
    },
    setModalType: (modal: galleryOrderModalTypes) => {
        set({modalType: modal})
    },
    artworkDetails: null,
    setArtworkDetails: (value: null | orderDetailsType) => {
        set({artworkDetails: value})
    },
    currentId: '',
    setCurrentId: (e: string) => {
        set({currentId: e})
    }
}))