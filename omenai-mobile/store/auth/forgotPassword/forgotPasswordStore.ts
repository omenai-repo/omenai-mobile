import { create } from "zustand";

type ForgotPasswordStoreTypes = {
    email: string,
    setEmail: (e: string) => void,
    isSuccess: boolean,
    updateSuccess: (e: boolean) => void,
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
        isSuccess: false,
        updateSuccess: (e: boolean) => {
            set({isSuccess: e})
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