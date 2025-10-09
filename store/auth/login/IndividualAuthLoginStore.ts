import { create } from 'zustand';

type IndividualAuthLoginStoreTypes = {
  individualLoginData: IndividualLoginData;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  clearInputs: () => void;
  isLoading: boolean;
  setIsLoading: (e: boolean) => void;
};

export const useIndividualAuthLoginStore = create<IndividualAuthLoginStoreTypes>((set, get) => ({
  individualLoginData: {
    email: 'dantereus1@gmail.com',
    password: 'Test12345@',
    device_push_token: '',
  },
  // individualLoginData: {
  //   email: '',
  //   password: '',
  //   device_push_token: '',
  // },
  setEmail: (email: string) => {
    const prevData = get().individualLoginData;
    set({ individualLoginData: { ...prevData, email: email } });
  },
  setPassword: (password: string) => {
    const prevData = get().individualLoginData;
    set({ individualLoginData: { ...prevData, password: password } });
  },
  clearInputs: () => {
    set({ individualLoginData: { email: '', password: '', device_push_token: '' } });
  },
  isLoading: false,
  setIsLoading: (e: boolean) => {
    set({ isLoading: e });
  },
}));
