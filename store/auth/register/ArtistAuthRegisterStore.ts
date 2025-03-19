import { create } from "zustand";

type ArtistSignupData = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    address: {
        address_line: string,
        city: string,
        country: string,
        zip: string,
        countryCode: string,
        state: string
    },
    art_style: string[],
    logo: any
}

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
    setState: (e: string) => void,
    setZipCode: (e: string) => void,
    setCountry: (e: string) => void,
    setCountryCode: (e: string) => void,
    stateData: {label: string, value: string}[], 
    setStateData: (e: {label: string, value: string}[]) => void, 
    cityData: {label: string, value: string}[], 
    setCityData: (e: {label: string, value: string}[]) => void, 
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
        setState: (state: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, address: {...data.address, state}}})
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
        stateData: [],
        setStateData: (stateData: {label: string, value: string}[]) => {
            set({stateData})
        },
        cityData: [],
        setCityData: (cityData: {label: string, value: string}[]) => {
            set({cityData})
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
                stateData: [],
                cityData: [],
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