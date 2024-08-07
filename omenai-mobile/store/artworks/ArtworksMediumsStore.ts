import { create } from "zustand";

type ArtworkStoreTypes = {
  artworks: any[];
  setArtworks: (artworks: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  pageCount: number;
  setPageCount: (count: number) => void;
  storemedium: string,
  setMedium: (e: string) => void
};
export const artworksMediumStore = create<ArtworkStoreTypes>((set, get) => ({
  artworks: [],
  setArtworks: (artworks: any[]) => {
    set({ artworks });
  },
  isLoading: false,
  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  pageCount: 1,
  setPageCount: (count: number) => {
    set({ pageCount: count });
  },
  medium: '',
  setMedium: (e: string) => {
    set({medium: e})
  }
}));
