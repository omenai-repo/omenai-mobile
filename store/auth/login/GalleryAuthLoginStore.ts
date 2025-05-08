import { create } from 'zustand';

type GalleryAuthLoginStoreTypes = {
  galleryLoginData: GalleryLoginData;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  clearInputs: () => void;
  isLoading: boolean;
  setIsLoading: (e: boolean) => void;
};

export const useGalleryAuthLoginStore = create<GalleryAuthLoginStoreTypes>((set, get) => ({
  galleryLoginData: {
    email: 'dantereus1@gmail.com',
    password: 'Test12345@',
  },
  setEmail: (email: string) => {
    const prevData = get().galleryLoginData;
    set({ galleryLoginData: { ...prevData, email: email } });
  },
  setPassword: (password: string) => {
    const prevData = get().galleryLoginData;
    set({ galleryLoginData: { ...prevData, password: password } });
  },
  clearInputs: () => {
    set({ galleryLoginData: { email: '', password: '' } });
  },
  isLoading: false,
  setIsLoading: (e: boolean) => {
    set({ isLoading: e });
  },
}));
