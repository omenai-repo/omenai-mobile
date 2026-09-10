import { create } from "zustand";
import type { CreateOrderModelTypes } from "#types/types";

export type artistOrderDataType = {
  pending: CreateOrderModelTypes[];
  processing: CreateOrderModelTypes[];
  completed: CreateOrderModelTypes[];
};
export type artistOrdersTab = "pending" | "processing" | "completed";

type artistOrdersStoreTypes = {
  data: artistOrderDataType;
  setData: (e: artistOrderDataType) => void;
  selectedTab: artistOrdersTab;
  setSelectedTab: (e: artistOrdersTab) => void;
};

export const artistOrdersStore = create<artistOrdersStoreTypes>((set, get) => ({
  data: { pending: [], processing: [], completed: [] },
  setData: (value: artistOrderDataType) => {
    set({ data: value });
  },
  selectedTab: "pending",
  setSelectedTab: (tab: artistOrdersTab) => {
    set({ selectedTab: tab });
  },
}));
