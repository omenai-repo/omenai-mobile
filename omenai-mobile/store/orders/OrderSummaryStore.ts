import { create } from "zustand";

type OrderSummaryStoreTypes = {
    selectedSectionIndex: number,
    setSelectedSectionIndex: (e: number) => void,
    deliveryMode: "Shipping" | "Pickup",
    setDeliveryMode: (e: "Shipping" | "Pickup") => void,
    fullname: string,
    setFullname: (e: string) => void,
    email: string,
    setEmail: (e: string) => void,
    deliveryAddress: string,
    setDeliveryAddress: (e: string) => void,
    country: string,
    city: string,
    state: string,
    zipCode: string,
    setCountry: (e: string) => void,
    setState: (e: string) => void,
    setCity: (e: string) => void,
    setZipCode: (e: string) => void

};

export const useOrderSummaryStore = create<OrderSummaryStoreTypes>(
    (set, get) => ({
        selectedSectionIndex: 1,
        setSelectedSectionIndex: (index: number) => {
            set({selectedSectionIndex: index})
        },
        deliveryMode: 'Shipping',
        setDeliveryMode: (e: "Shipping" | "Pickup") => {
            set({deliveryMode: e})
        },
        fullname: '',
        setFullname: (e: string) => {
            set({fullname: e})
        },
        email: '',
        setEmail: (e: string) => {
            set({email: e})
        },
        deliveryAddress: '',
        setDeliveryAddress: (e: string) => {
            set({deliveryAddress: e})
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
    })
)