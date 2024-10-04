import { create } from "zustand";

type ForgotPasswordStoreTypes = {
    email: string,
    setEmail: (e: string) => void,
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    clearState: () => void
};

export const useForgetPasswordStore = create<ForgotPasswordStoreTypes>(
    (set, get) => ({
        email: "",
        setEmail: (email: string) => {
            set({email})
        },
        isLoading: false,
        setIsLoading: (e: boolean) => {
            set({isLoading: e})
        },
        clearState: () => {
            set({email: ''})
        }
    })
)