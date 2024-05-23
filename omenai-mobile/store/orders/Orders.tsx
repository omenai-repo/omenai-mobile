import { OrderTabsTypes } from "screens/orders/Orders";
import { create } from "zustand";

type OrdersStoreTypes = {
    selectedTab: OrderTabsTypes,
    setSelectedTab: (e: OrderTabsTypes) => void,
    isLoading: boolean,
    setIsLoading: (e: boolean) => void,
    data: any[],
    setData: (e: any[]) => void
};

export const useOrderStore = create<OrdersStoreTypes>(
    (set, get) => ({
        selectedTab: 'Pending',
        setSelectedTab: (e: OrderTabsTypes) => {
            set({selectedTab: e})
        },
        isLoading: false,
        setIsLoading: (e: boolean) => {
            set({isLoading: e})
        },
        data: [],
        setData: (e: any[]) => {
            set({data: e})
        }
    })
)