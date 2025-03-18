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
    setSelectedTerms: (e: number[]) => void,
    setAddress: (e: string) => void
    setCity: (e: string) => void,
    setZipCode: (e: string) => void,
    setCountry: (e: string) => void,
    setCountryCode: (e: string) => void,
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    clearState: () => void
};

export const useIndividualAuthRegisterStore = create<IndividualAuthRegisterStoreType>(
    (set, get) => ({
        individualRegisterData: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            address: {
                address_line: "",
                city: "",
                country: "",
                zip: "",
                countryCode: "",
                state: ""
            },
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
        setAddress: (address: string) => {
            const data = get().individualRegisterData
            set({individualRegisterData: {...data, address: {...data.address, address_line: address}}})
        },
        setCountry: (country: string) => {
            const data = get().individualRegisterData
            set({individualRegisterData: {...data, address: {...data.address, country}}})
        },
        setCity: (city: string) => {
            const data = get().individualRegisterData
            set({individualRegisterData: {...data, address: {...data.address, city}}})
        },
        setZipCode: (zipCode: string) => {
            const data = get().individualRegisterData
            set({individualRegisterData: {...data, address: {...data.address, zip: zipCode}}})
        },
        setCountryCode: (countryCode: string) => {
            const data = get().individualRegisterData
            set({individualRegisterData: {...data, address: {...data.address, countryCode}}})
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
        },
        isLoading: false,
        setIsLoading: (e: boolean) => {
            set({isLoading: e})
        },
        clearState: () => {
            set({
                individualRegisterData: {name: "", email: "", password: "", confirmPassword: "", address: {
                    address_line: "",
                    city: "",
                    country: "",
                    zip: "",
                    countryCode: "",
                    state: ""
                }},
                isLoading: false,
                pageIndex: 0,
                preferences: [],
                selectedTerms: [],
                
            })
        }
    })
)