import { create } from "zustand";

type AppStoreTypes = {
    isLoggedIn: boolean,
    setIsLoggedIn: (e: boolean) => void,
    userSession: any,
    setUserSession: (e: any) => void
}

export const useAppStore = create<AppStoreTypes>(
    (set, get) => ({
        isLoggedIn: false,
        setIsLoggedIn: (e: boolean) => {
            set({isLoggedIn: e})
        },
        userSession: null,
        setUserSession: (e: any) => {
            set({userSession: e})
        }
    })
)