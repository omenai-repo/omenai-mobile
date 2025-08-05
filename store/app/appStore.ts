import { create } from 'zustand';

type userType = 'user' | 'artist' | 'gallery' | '';

type AppStoreTypes = {
  isLoggedIn: boolean;
  setIsLoggedIn: (e: boolean) => void;
  userSession: any;
  setUserSession: (e: any) => void;
  userType: userType;
  setUserType: (e: userType) => void;
  expoPushToken: string | null;
  setExpoPushToken: (token: string) => void;
};

export const useAppStore = create<AppStoreTypes>((set, get) => ({
  isLoggedIn: false,
  setIsLoggedIn: (e: boolean) => {
    set({ isLoggedIn: e });
  },
  userSession: null,
  setUserSession: (e: any) => {
    set({ userSession: e });
  },
  userType: '',
  setUserType: (e: userType) => {
    set({ userType: e });
  },
  expoPushToken: null,
  setExpoPushToken: (token) => set({ expoPushToken: token }),
}));
