import { OrderTabsTypes } from 'screens/orders/Orders';
import { create } from 'zustand';

type OrdersStoreTypes = {
  selectedTab: OrderTabsTypes;
  setSelectedTab: (e: OrderTabsTypes) => void;
  isLoading: boolean;
  setIsLoading: (e: boolean) => void;
  data: {
    pendingOrders: CreateOrderModelTypes[];
    completedOrders: CreateOrderModelTypes[];
  };
  setData: (e: {
    pendingOrders: CreateOrderModelTypes[];
    completedOrders: CreateOrderModelTypes[];
  }) => void;
  refreshTrigger: number;
  setRefreshTrigger: (e: number) => void;
};

export const useOrderStore = create<OrdersStoreTypes>((set, get) => ({
  selectedTab: 'pending',
  setSelectedTab: (e: OrderTabsTypes) => {
    set({ selectedTab: e });
  },
  isLoading: false,
  setIsLoading: (e: boolean) => {
    set({ isLoading: e });
  },
  data: {
    completedOrders: [],
    pendingOrders: [],
  },
  setData: (e: {
    pendingOrders: CreateOrderModelTypes[];
    completedOrders: CreateOrderModelTypes[];
  }) => {
    set({ data: e });
  },
  refreshTrigger: 0,
  setRefreshTrigger: (e: number) => {
    set({ refreshTrigger: e });
  },
}));
