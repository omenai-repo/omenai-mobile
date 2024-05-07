import { create } from "zustand";

type IndividualAuthRegisterStoreType = {
    individualRegisterData: IndividualRegisterData,
    setEmail: (e: string) => void,
    setName: (e: string) => void,
    setPassword: (e: string) => void,
    setConfirmPassword: (e: string) => void,
    pageIndex: number,
    setPageIndex: (e: number) => void,
    preferences: string[],
    setPreferences: (e: string[]) => void,
    selectedTerms: number[],
    setSelectedTerms: (e: number[]) => void
};

export const useIndividualAuthRegisterStore = create<IndividualAuthRegisterStoreType>(
    (set, get) => ({
        individualRegisterData: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        setName: (name: string) => {
            const data = get().individualRegisterData
            set({individualRegisterData: {...data, name}})
        },
        setEmail: (email: string) => {
            const data = get().individualRegisterData
            set({individualRegisterData: {...data, email}})
        },
        setPassword: (password: string) => {
            const data = get().individualRegisterData
            set({individualRegisterData: {...data, password}})
        },
        setConfirmPassword: (confirmPassword: string) => {
            const data = get().individualRegisterData
            set({individualRegisterData: {...data, confirmPassword}})
        },
        pageIndex: 0,
        setPageIndex: (e: number) => {
            set({pageIndex: e})
        },
        preferences: [],
        setPreferences: (e: string[]) => {
            set({preferences: e})
        },
        selectedTerms: [],
        setSelectedTerms: (e: number[]) => {
            set({selectedTerms: e})
        }
    })
)