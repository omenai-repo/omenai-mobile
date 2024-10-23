import { create } from "zustand";

export type galleryOrderDataType = {pending: any[], processing: any[], completed: any[]};
export type galleryOrdersTab = 'pending' | 'processing' | 'completed'

type galleryOrdersStoreTypes = {
    data: galleryOrderDataType,
    setData: (e: galleryOrderDataType) => void,
    selectedTab: galleryOrdersTab,
    setSelectedTab: (e: galleryOrdersTab) => void
};

export const galleryOrdersStore = create<galleryOrdersStoreTypes>((set, get) => ({
    data: {pending: [], processing: [], completed: []},
    setData: (value: galleryOrderDataType) => {
        set({data: value})
    },
    selectedTab: 'pending',
    setSelectedTab: (tab: galleryOrdersTab) => {
        set({selectedTab: tab})
    }
}))