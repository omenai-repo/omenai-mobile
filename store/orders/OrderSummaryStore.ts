import { create } from "zustand";

type OrderSummaryStoreTypes = {
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    artworkOrderData: artworkOrderDataTypes,
    setArtworkOrderData: (e: artworkOrderDataTypes) => void,
    selectedSectionIndex: number,
    setSelectedSectionIndex: (e: number) => void,
    deliveryMode: "Shipping" | "Pickup",
    setDeliveryMode: (e: "Shipping" | "Pickup") => void,
    name: string,
    setName: (e: string) => void,
    email: string,
    setEmail: (e: string) => void,
    address: string,
    setDeliveryAddress: (e: string) => void,
    country: string,
    city: string,
    state: string,
    zipCode: string,
    setCountry: (e: string) => void,
    setState: (e: string) => void,
    setCity: (e: string) => void,
    setZipCode: (e: string) => void,
    saveShippingAddress: boolean,
    setSaveShippingAddress: (e: boolean) => void
    resetState: () => void
};

export const useOrderSummaryStore = create<OrderSummaryStoreTypes>(
    (set, get) => ({
        isLoading: false,
        setIsLoading: (e: boolean) => {
            set({isLoading: e})
        },
        selectedSectionIndex: 1,
        setSelectedSectionIndex: (index: number) => {
            set({selectedSectionIndex: index})
        },
        deliveryMode: 'Shipping',
        setDeliveryMode: (e: "Shipping" | "Pickup") => {
            set({deliveryMode: e})
        },
        name: '',
        setName: (e: string) => {
            set({name: e})
        },
        email: '',
        setEmail: (e: string) => {
            set({email: e})
        },
        address: '',
        setDeliveryAddress: (e: string) => {
            set({address: e})
        },
        city: '',
        setCity: (e: string) => {
            set({city: e})
        },
        state: '',
        setState: (e: string) => {
            set({state: e})
        },
        zipCode: '',
        setZipCode: (e: string) => {
            set({zipCode: e})
        },
        country: '',
        setCountry: (e: string) => {
            set({country: e})
        },
        artworkOrderData: {} as artworkOrderDataTypes,
        setArtworkOrderData: (e: artworkOrderDataTypes) => {
            set({artworkOrderData: e})
        },
        saveShippingAddress: false,
        setSaveShippingAddress: (e: boolean) => {
            set({saveShippingAddress: e})
        },
        resetState: () => {
            set({
                selectedSectionIndex: 1,
                address: '',
                isLoading: false,
                email: '',
                name: '',
                state: '',
                zipCode: '',
                country: '',
                artworkOrderData: {} as artworkOrderDataTypes,
            })
        }
    })
)