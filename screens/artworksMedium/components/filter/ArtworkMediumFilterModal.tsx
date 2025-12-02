import React from "react";
import PriceFilter from "./PriceFilter";
import YearFilter from "./YearFilter";
import { artworkActionStore } from "store/artworks/ArtworkActionStore";
import { fetchPaginatedArtworks } from "services/artworks/fetchPaginatedArtworks";
import RarityFilter from "./RarityFilter";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { artworksMediumFilterStore } from "store/artworks/ArtworksMediumFilterStore";
import { artworksMediumStore } from "store/artworks/ArtworksMediumsStore";
import GenericFilterLayout from "components/filter/GenericFilterLayout";

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
