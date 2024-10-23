import { create } from "zustand";

export type FilterStoreTypes = {
  filterOptions: {
    price: {
      min: number;
      max: number;
    }[];
    year: {
      min: number;
      max: number;
    }[];
    medium: string[];
    rarity: string[];
  };
  updateFilter: (label: string, value: string) => void;
  removeFilter: (label: string, value: any) => void;
  selectedFilters: SelectedFilterArray[];
  setSelectedFilters: (value: string, name: string, label: string) => void;
  removeSingleFilterSelection: (filter: string) => void;
  clearAllFilters: () => void;
  artworks: any[];
  setArtworks: (artworks: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  pageCount: number;
  setPageCount: (count: number) => void;
  category: artworkListingType,
  setCategory: (e: artworkListingType) => void,
  artworkCount: number,
  setArtworkCount: (count: number) => void
};

type SelectedFilterArray = {
  name: string;
  label: string;
  value: string;
};

export const artworkCategoriesStore = create<FilterStoreTypes>((set, get) => ({
  filterOptions: {
    price: [],
    year: [],
    rarity: [],
    medium: []
  },

  updateFilter: (label: string, value: string) => {
    const currentFilterData: Record<string, any> = get().filterOptions;
    if (!label || typeof value === "undefined") {
      return; // Do nothing if filters, label, or value is missing
    }

    if (currentFilterData.hasOwnProperty(label)) {
      const filterArray = currentFilterData[label];

      filterArray.push(JSON.parse(value)); // Add the value if it doesn'  t already exist

      set({ filterOptions: currentFilterData as any });
    }
  },

  removeFilter: (label: string, value: any) => {
    if (!label || typeof value === "undefined") {
      return; // Do nothing if filters, label, or value is missing
    }

    const currentFilterData: Record<string, any> = get().filterOptions;
    const parsedValue = JSON.parse(value);

    if (currentFilterData.hasOwnProperty(label)) {
      const filterArray = currentFilterData[label];

      const index = filterArray.findIndex((item: any) => {
        // Comparison logic based on filter type (price, year, etc.)
        if (label === "price" || label === "year") {
          return item.min === parsedValue.min && item.max === parsedValue.max; // Compare whole objects for price/year ranges
        } else {
          return item === parsedValue; // Simple comparison for other filter types (medium, rarity)
        }
      });

      if (index > -1) {
        filterArray.splice(index, 1); // Remove the element at the index

        // Check if the array is empty after removal
        if (filterArray.length === 0) {
          currentFilterData[label] = []; // Set the value to an empty array if the filter becomes empty
        }
      }
      set({ filterOptions: currentFilterData as any });
    }
  },
  selectedFilters: [],

  setSelectedFilters: (value: string, name: string, label: string) => {
    const currentFilterSelection = get().selectedFilters;
    currentFilterSelection.push({ value, name, label });
    set({ selectedFilters: currentFilterSelection });
  },

  removeSingleFilterSelection: (name: string) => {
    const currentFilterSelection = get().selectedFilters;

    const currentSelectedFilter = currentFilterSelection.find(
      (filter) => filter.name === name
    );
    const removeFilterValue = get().removeFilter;

    removeFilterValue(
      currentSelectedFilter!.label,
      currentSelectedFilter!.value
    );

    const removeSelectedFilter = currentFilterSelection.filter(
      (element) => element.name !== name
    );

    set({ selectedFilters: removeSelectedFilter });
  },

  clearAllFilters: () => {
    set({
      filterOptions: {
        price: [],
        year: [],
        rarity: [],
        medium: [],
      },
    });
    set({ selectedFilters: [] });
  },
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
  category: '',
  setCategory: (e: artworkListingType) => {
    set({category: e})
  },
  artworkCount: 0,
  setArtworkCount: (count: number) => {
    set({artworkCount: count})
  }
}));
