export type SelectedFilterArray = {
  name: string;
  label: string;
  value: string;
};

export type SharedFilterStore = {
  filterOptions: {
    price: { min: number; max: number }[];
    year: { min: number; max: number }[];
    medium?: string[];
    rarity: string[];
  };
  updateFilter: (label: string, value: string) => void;
  removeFilter: (label: string, value: any) => void;
  selectedFilters: SelectedFilterArray[];
  setSelectedFilters: (value: string, name: string, label: string) => void;
  removeSingleFilterSelection: (filter: string) => void;
  clearAllFilters: () => void;
};
