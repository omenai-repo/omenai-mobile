import { create } from "zustand";

type ArtworkActionStoreTypes = {
  paginationCount: number;
  updatePaginationCount: (type: "dec" | "inc" | "reset") => void;
};
export const artworkActionStore = create<ArtworkActionStoreTypes>(
  (set, get) => ({
    paginationCount: 1,
    updatePaginationCount: (type: "dec" | "inc" | "reset") => {
      const currentPage = get().paginationCount;

      if (type === "dec" && currentPage === 1) {
        return;
      }
      if (type === "inc") set({ paginationCount: currentPage + 1 });
      if (type === "dec") set({ paginationCount: currentPage - 1 });
      if (type === "reset") set({ paginationCount: 1 });
    },
  })
);
