import { create } from "zustand";

type ForgotPasswordStoreTypes = {
    email: string,
    setEmail: (e: string) => void,
    isSuccess: boolean,
    updateSuccess: (e: boolean) => void
};

export const useForgerPasswordStore = create<ForgotPasswordStoreTypes>(
    (set, get) => ({
        email: "",
        setEmail: (email: string) => {
            set({email})
        },
        isSuccess: false,
        updateSuccess: (e: boolean) => {
            set({isSuccess: e})
        }
    })
)