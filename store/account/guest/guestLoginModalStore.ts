import { create } from "zustand";

type RedirectContext = {
  screen: string;
  params?: Record<string, unknown>;
};

type GuestLoginModalStore = {
  isOpen: boolean;
  redirectContext: RedirectContext | null;
  openGuestLoginModal: (redirectContext?: RedirectContext) => void;
  closeGuestLoginModal: () => void;
  clearRedirectContext: () => void;
};

export const useGuestLoginModalStore = create<GuestLoginModalStore>((set) => ({
  isOpen: false,
  redirectContext: null,
  openGuestLoginModal: (redirectContext) =>
    set({ isOpen: true, redirectContext: redirectContext ?? null }),
  closeGuestLoginModal: () => set({ isOpen: false }),
  clearRedirectContext: () => set({ redirectContext: null }),
}));
