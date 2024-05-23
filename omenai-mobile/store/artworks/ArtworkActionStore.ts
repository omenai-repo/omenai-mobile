import { create } from "zustand";

type ArtworkActionStoreTypes = {
  paginationCount: number;
  updatePaginationCount: (type: "inc" | "reset") => void;
};
export const artworkActionStore = create<ArtworkActionStoreTypes>(
  (set, get) => ({
    paginationCount: 1,
    updatePaginationCount: (type: "dec" | "inc" | "reset") => {
      const currentPage = get().paginationCount;

      if (type === "inc") set({ paginationCount: currentPage + 1 });
      if (type === "reset") set({ paginationCount: 1 });
    },
  })
);
