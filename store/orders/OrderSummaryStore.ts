import { create } from 'zustand';

type OrderSummaryStoreTypes = {
  isLoading: boolean;
  setIsLoading: (e: boolean) => void;
  artworkOrderData: artworkOrderDataTypes;
  setArtworkOrderData: (e: artworkOrderDataTypes) => void;
  selectedSectionIndex: number;
  setSelectedSectionIndex: (e: number) => void;
  deliveryMode: 'Shipping' | 'Pickup';
  setDeliveryMode: (e: 'Shipping' | 'Pickup') => void;
  name: string;
  setName: (e: string) => void;
  email: string;
  setEmail: (e: string) => void;
  address: string;
  setDeliveryAddress: (e: string) => void;
  country: string;
  countryCode: string;
  city: string;
  state: string;
  stateCode: string;
  zipCode: string;
  setCountry: (e: string) => void;
  setCountryCode: (e: string) => void;
  setState: (e: string) => void;
  setStateCode: (e: string) => void;
  setCity: (e: string) => void;
  setZipCode: (e: string) => void;
  stateData: { label: string; value: string }[];
  setStateData: (e: { label: string; value: string }[]) => void;
  cityData: { label: string; value: string }[];
  setCityData: (e: { label: string; value: string }[]) => void;
  saveShippingAddress: boolean;
  setSaveShippingAddress: (e: boolean) => void;
  resetState: () => void;
};

export const useOrderSummaryStore = create<OrderSummaryStoreTypes>((set, get) => ({
  isLoading: false,
  setIsLoading: (e: boolean) => {
    set({ isLoading: e });
  },
  selectedSectionIndex: 1,
  setSelectedSectionIndex: (index: number) => {
    set({ selectedSectionIndex: index });
  },
  deliveryMode: 'Shipping',
  setDeliveryMode: (e: 'Shipping' | 'Pickup') => {
    set({ deliveryMode: e });
  },
  name: '',
  setName: (e: string) => {
    set({ name: e });
  },
  email: '',
  setEmail: (e: string) => {
    set({ email: e });
  },
  address: '',
  setDeliveryAddress: (e: string) => {
    set({ address: e });
  },
  city: '',
  setCity: (e: string) => {
    set({ city: e });
  },
  state: '',
  setState: (e: string) => {
    set({ state: e });
  },
  stateCode: '',
  setStateCode: (e: string) => {
    set({ stateCode: e });
  },
  zipCode: '',
  setZipCode: (e: string) => {
    set({ zipCode: e });
  },
  country: '',
  setCountry: (e: string) => {
    set({ country: e });
  },
  countryCode: '',
  setCountryCode: (e: string) => {
    set({ countryCode: e });
  },
  artworkOrderData: {} as artworkOrderDataTypes,
  setArtworkOrderData: (e: artworkOrderDataTypes) => {
    set({ artworkOrderData: e });
  },
  stateData: [],
  setStateData: (stateData: { label: string; value: string }[]) => {
    set({ stateData });
  },
  cityData: [],
  setCityData: (cityData: { label: string; value: string }[]) => {
    set({ cityData });
  },
  saveShippingAddress: false,
  setSaveShippingAddress: (e: boolean) => {
    set({ saveShippingAddress: e });
  },
  resetState: () => {
    set({
      selectedSectionIndex: 1,
      address: '',
      isLoading: false,
      email: '',
      name: '',
      state: '',
      zipCode: '',
      country: '',
      stateData: [],
      cityData: [],
      artworkOrderData: {} as artworkOrderDataTypes,
    });
  },
}));
