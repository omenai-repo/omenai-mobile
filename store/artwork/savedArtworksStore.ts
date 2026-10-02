import { create } from 'zustand'

type SavedArtworksStoreTypes = {
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    data: any[],
    setData: (e: any[]) => void
};

export const UseSavedArtworksStore = create<SavedArtworksStoreTypes>(
    (set, get) => ({
        isLoading: false,
        setIsLoading: (e: boolean) => {
            set({isLoading: e})
        },
        data: [],
        setData: (e: any[]) => {
            set({data: e})
        }
    })
)