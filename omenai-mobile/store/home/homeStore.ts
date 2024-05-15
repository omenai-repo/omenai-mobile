import { create } from "zustand";

type HomeStoreTypes = {
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    data: [],
    setData: (e: any[]) => void
};

export const useHomeStore = create<HomeStoreTypes>(
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