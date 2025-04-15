import { create } from 'zustand';

type ArtistAuthLoginStoreTypes = {
  artistLoginData: ArtistLoginData;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  clearInputs: () => void;
  isLoading: boolean;
  setIsLoading: (e: boolean) => void;
};

export const useArtistAuthLoginStore = create<ArtistAuthLoginStoreTypes>((set, get) => ({
  artistLoginData: {
    email: 'dantereus1@gmail.com',
    password: 'Test12345@',
  },
  setEmail: (email: string) => {
    const prevData = get().artistLoginData;
    set({ artistLoginData: { ...prevData, email: email } });
  },
  setPassword: (password: string) => {
    const prevData = get().artistLoginData;
    set({ artistLoginData: { ...prevData, password: password } });
  },
  clearInputs: () => {
    set({ artistLoginData: { email: '', password: '' } });
  },
  isLoading: false,
  setIsLoading: (e: boolean) => {
    set({ isLoading: e });
  },
}));
