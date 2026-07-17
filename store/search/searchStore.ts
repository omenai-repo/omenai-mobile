import { create } from "zustand";

type SearchStoreTypes = {
  isLoading: boolean;
  searchQuery: string;
  submittedQuery: string;
  setIsLoading: (e: boolean) => void;
  setSearchQuery: (e: string) => void;
  setSubmittedQuery: (e: string) => void;
};

export const useSearchStore = create<SearchStoreTypes>((set, get) => ({
  isLoading: false,
  searchQuery: "",
  submittedQuery: "",
  setIsLoading: (e: boolean) => {
    set({ isLoading: e });
  },
  setSearchQuery: (e: string) => {
    set({ searchQuery: e });
  },
  setSubmittedQuery: (e: string) => {
    set({ submittedQuery: e });
  },
}));
