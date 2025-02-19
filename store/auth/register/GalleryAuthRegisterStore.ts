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
    setLocation: (e: string) => void,
    setDescription: (e: string) => void,
    country: string,
    setCountry: (e: string) => void,
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    selectedTerms: number[],
    setSelectedTerms: (e: number[]) => void,
    clearState: () => void,
    galleryLogo: any,
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
            location: "",
            description: "",
            country: ""
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
        setLocation: (location: string) => {
            const data = get().galleryRegisterData
            set({galleryRegisterData: {...data, location}})
        },
        country: '',
        setCountry: (country: string) => {
            set({country: country})
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
                    location: "",
                    description: "",
                    country: ""
                }
            })
        },
        galleryLogo: null,
        setGalleryLogo: (logo: any) => { set({galleryLogo: logo}) },
    })
)