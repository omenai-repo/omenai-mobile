import { create } from "zustand";

type GalleryAuthRegisterStoreType = {
    pageIndex: number,
    setPageIndex: (e: number) => void,
    galleryRegisterData: GallerySignupData,
    setEmail: (e: string) => void,
    setName: (e: string) => void,
    setPassword: (e: string) => void,
    setConfirmPassword: (e: string) => void,
    setAdmin: (e: string) => void,
    setAddress: (e: string) => void,
    setDescription: (e: string) => void,
    setCity: (e: string) => void,
    setZipCode: (e: string) => void,
    setCountry: (e: string) => void,
    setCountryCode: (e: string) => void,
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    selectedTerms: number[],
    setSelectedTerms: (e: number[]) => void,
    clearState: () => void,
    setGalleryLogo: (image: any) => void,
}

export const useGalleryAuthRegisterStore = create<GalleryAuthRegisterStoreType>(
    (set, get) => ({
        pageIndex: 0,
        setPageIndex: (e: number) => {
            set({pageIndex: e})
        },
        galleryRegisterData: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            admin: "",
            address: {
                address_line: "",
                city: "",
                country: "",
                zip: "",
                countryCode: "",
                state: ""
            },
            description: "",
            logo: {
                assets: []
            }
        },
        setName: (name: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, name}})
        },
        setEmail: (email: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, email}})
        },
        setPassword: (password: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, password}})
        },
        setConfirmPassword: (confirmPassword: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, confirmPassword}})
        },
        setAdmin: (admin: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, admin}})
        },
        setAddress: (address: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, address: {...data.address, address_line: address}}})
        },
        setCountry: (country: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, address: {...data.address, country: country}}})
        },
        setCity: (city: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, address: {...data.address, city}}})
        },
        setZipCode: (zipCode: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, address: {...data.address, zip: zipCode}}})
        },
        setCountryCode: (countryCode: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, address: {...data.address, countryCode}}})
        },
        setDescription: (description: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, description}})
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
                galleryRegisterData: {
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    admin: "",
                    address: {
                        address_line: "",
                        city: "",
                        country: "",
                        zip: "",
                        countryCode: "",
                        state: ""
                    },
                    description: "",
                    logo: {
                        assets: []
                    }
                }
            })
        },
        setGalleryLogo: (logo: any) => { 
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, logo}})
        },
    })
)