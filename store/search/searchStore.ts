import { create } from "zustand";

type SearchStoreTypes = {
    isLoading: boolean,
    searchQuery: string,
    setIsLoading: (e: boolean) => void,
    setSearchQuery: (e: string) => void
};

export const useSearchStore = create<SearchStoreTypes>(
    (set, get) => ({
        isLoading: false,
        searchQuery: '',
        setIsLoading: (e: boolean) => {
            set({isLoading: e})
        },
        setSearchQuery: (e: string) => {
            set({searchQuery: e})
        }
    })
)