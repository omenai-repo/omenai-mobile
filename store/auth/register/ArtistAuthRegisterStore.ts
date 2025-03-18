import { create } from "zustand";

type ArtistAuthRegisterStoreType = {
    pageIndex: number,
    setPageIndex: (e: number) => void,
    artistRegisterData: ArtistSignupData,
    setEmail: (e: string) => void,
    setName: (e: string) => void,
    setPassword: (e: string) => void,
    setConfirmPassword: (e: string) => void,
    setHomeAddress: (e: string) => void,
    setCity: (e: string) => void,
    setZipCode: (e: string) => void,
    setCountry: (e: string) => void,
    setCountryCode: (e: string) => void,
    artStyles: string[],
    setArtStyles: (e: string[]) => void,
    setArtistPhoto: (image: any) => void,
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    selectedTerms: number[],
    setSelectedTerms: (e: number[]) => void,
    clearState: () => void,
}

export const useArtistAuthRegisterStore = create<ArtistAuthRegisterStoreType>(
    (set, get) => ({
        pageIndex: 0,
        setPageIndex: (e: number) => {
            set({pageIndex: e})
        },
        artistRegisterData: {
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
            art_style: [],
            logo: null
        },
        setName: (name: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, name}})
        },
        setEmail: (email: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, email}})
        },
        setPassword: (password: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, password}})
        },
        setConfirmPassword: (confirmPassword: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, confirmPassword}})
        },
        setHomeAddress: (homeAddress: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, address: {...data.address, address_line: homeAddress}}})
        },
        setCity: (city: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, address: {...data.address, city}}})
        },
        setZipCode: (zipCode: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, address: {...data.address, zip: zipCode}}})
        },
        setCountry: (country: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, address: {...data.address, country}}})
        },
        setCountryCode: (countryCode: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, address: {...data.address, countryCode}}})
        },
        artStyles: [],
        setArtStyles: (art_style: string[]) => {
            set({artStyles: art_style})
        },
        setArtistPhoto: (logo: null) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, logo}})
        },
        isLoading: false,
        setIsLoading: (e: boolean) => {
            set({isLoading: e})
        },
        selectedTerms: [],
        setSelectedTerms: (e: number[]) => {
            set({selectedTerms: e})
        },
        clearState: () => {
            set({
                isLoading: false,
                pageIndex: 0,
                artistRegisterData: {
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
                art_style: [],
                logo: null
                }
            })
        }
    })
)