import React from "react";
import PriceFilter from "./PriceFilter";
import YearFilter from "./YearFilter";
import { artworkActionStore } from "#store/artwork/artworkActionStore";
import { fetchPaginatedArtworks } from "#services/artwork/fetchPaginatedArtworks";
import RarityFilter from "./RarityFilter";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { artworksMediumFilterStore } from "#store/artwork/artworksMediumFilterStore";
import { artworksMediumStore } from "#store/artwork/artworksMediumStore";
import GenericFilterLayout from "#components/filter/GenericFilterLayout";

export default function ArtworkMediumFilterModal() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { filterOptions, selectedFilters, clearAllFilters } =
    artworksMediumFilterStore();
  const { paginationCount, updatePaginationCount } = artworkActionStore();
  const { setArtworks, setIsLoading, setPageCount, isLoading, medium } =
    artworksMediumStore();

  const handleSubmitFilter = async () => {
    updatePaginationCount("reset");
    setIsLoading(true);
    const response = await fetchPaginatedArtworks(paginationCount, {
      ...filterOptions,
      medium: [medium],
    });
    if (response?.isOk) {
      setPageCount(response.count);
      setArtworks(response.data);
    } else {
    }
    setIsLoading(false);
    navigation.goBack();
  };

  return (
    <GenericFilterLayout
      onApply={handleSubmitFilter}
      onClear={clearAllFilters}
      selectedFilters={selectedFilters}
      isLoading={isLoading}
    >
      <PriceFilter />
      <YearFilter />
      <RarityFilter />
    </GenericFilterLayout>
  );
}
