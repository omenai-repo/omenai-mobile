import { create } from "zustand";

type HomeStoreTypes = {
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    data: [],
    setData: (e: any[]) => void,
    listingType: artworkListingType,
    setListingType: (e: artworkListingType) => void,
    showSelectModal: boolean,
    setShowSelectModal: (e: boolean) => void
};

export const useHomeStore = create<HomeStoreTypes>(
    (set, get) => ({
        isLoading: false,
        setIsLoading: (e: boolean) => {
            set({isLoading: e})
        },
        data: [],
        setData: (e: any[]) => {
            // set({data: e})
        },
        listingType: 'recent',
        setListingType: (e: artworkListingType) => {
            set({listingType: e})
        },
        showSelectModal: false,
        setShowSelectModal: (e: boolean) => {
            set({showSelectModal: e})
        }
    })
)