import { OrderTabsTypes } from "screens/orders/Orders";
import { create } from "zustand";

type OrdersStoreTypes = {
    selectedTab: OrderTabsTypes,
    setSelectedOrderTypes: (e: OrderTabsTypes) => void
};

export const useOrderStore = create<OrdersStoreTypes>(
    (set, get) => ({
        selectedTab: 'Orders',
        setSelectedOrderTypes: (e: OrderTabsTypes) => {
            set({selectedTab: e})
        }
    })
)