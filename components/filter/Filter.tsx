import React from "react";
import { filterStore } from "store/artworks/FilterStore";
import PriceFilter from "./PriceFilter";
import YearFilter from "./YearFilter";
import MediumFilter from "./MediumFilter";
import { artworkStore } from "store/artworks/ArtworkStore";
import { artworkActionStore } from "store/artworks/ArtworkActionStore";
import { fetchPaginatedArtworks } from "services/artworks/fetchPaginatedArtworks";
import RarityFilter from "./RarityFilter";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import GenericFilterLayout from "./GenericFilterLayout";

type FilterProps = {
  children?: React.ReactNode;
};

export default function Filter({ children }: FilterProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { filterOptions, selectedFilters, clearAllFilters } = filterStore();
  const { paginationCount, updatePaginationCount } = artworkActionStore();
  const { setArtworks, setIsLoading, setPageCount, isLoading } = artworkStore();

  const handleSubmitFilter = async () => {
    updatePaginationCount("reset");
    await fetchAndApply(paginationCount, filterOptions, true);
  };

  const handleClearAndApply = async () => {
    updatePaginationCount("reset");
    clearAllFilters();
    await fetchAndApply(
      1,
      { medium: [], price: [], rarity: [], year: [] },
      true
    );
  };

  const fetchAndApply = async (
    page: number,
    options: any,
    goBack: boolean = false
  ) => {
    try {
      setIsLoading(true);
      const response = await fetchPaginatedArtworks(page, options);
      if (response?.isOk) {
        setPageCount(response.count);
        setArtworks(response.data);
      }
    } finally {
      setIsLoading(false);
      if (goBack) navigation.goBack();
    }
  };

  return (
    <GenericFilterLayout
      onApply={handleSubmitFilter}
      onClear={handleClearAndApply}
      selectedFilters={selectedFilters}
      isLoading={isLoading}
    >
      <PriceFilter />
      <YearFilter />
      <MediumFilter />
      <RarityFilter />
    </GenericFilterLayout>
  );
}
