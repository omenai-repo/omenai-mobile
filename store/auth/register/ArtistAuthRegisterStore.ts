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
    country: string,
    setCountry: (e: string) => void,
    artStyles: string[],
    setArtStyles: (e: string[]) => void,
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
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
            homeAddress: "",
            city: "",
            zipCode: "",
            country: "",
            artStyles: []
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
            set({artistRegisterData: {...data, homeAddress}})
        },
        setCity: (city: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, city}})
        },
        setZipCode: (zipCode: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, zipCode}})
        },
        country: "",
        setCountry: (country: string) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, country}})
        },
        artStyles: [],
        setArtStyles: (artStyles: string[]) => {
            const data = get().artistRegisterData
            set({artistRegisterData: {...data, artStyles}})
        },
        isLoading: false,
        setIsLoading: (e: boolean) => {
            set({isLoading: e})
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
                    homeAddress: "",
                    city: "",
                    zipCode: "",
                    country: "",
                    artStyles: []
                }
            })
        }
    })
)