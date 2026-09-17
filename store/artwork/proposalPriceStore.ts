import { create } from "zustand";

type ProposalPriceStoreType = {
  submittedProposalPrice: number | null;
  setSubmittedProposalPrice: (price: number | null) => void;
};

export const useProposalPriceStore = create<ProposalPriceStoreType>((set) => ({
  submittedProposalPrice: null,
  setSubmittedProposalPrice: (price) => set({ submittedProposalPrice: price }),
}));
