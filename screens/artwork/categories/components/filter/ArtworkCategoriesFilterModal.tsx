import React from "react";
import PriceFilter from "./PriceFilter";
import YearFilter from "./YearFilter";
import RarityFilter from "./RarityFilter";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { artworkCategoriesStore } from "#store/artwork/artworkCategoriesStore";
import MediumFilter from "./MediumFilter";
import GenericFilterLayout from "#components/filter/GenericFilterLayout";

export default function ArtworkCategoriesFilterModal() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const {
    setArtworks,
    setPageCount,
    isLoading,
    clearAllFilters,
    selectedFilters,
    setArtworkCount,
  } = artworkCategoriesStore();

  const handleSubmitFilter = async () => {
    setPageCount(1);
    setArtworkCount(0);
    setArtworks([]);
    navigation.goBack();
  };

  return (
    <GenericFilterLayout
      onApply={handleSubmitFilter}
      onClear={clearAllFilters}
      selectedFilters={selectedFilters}
      isLoading={isLoading}
    >
      <MediumFilter />
      <PriceFilter />
      <YearFilter />
      <RarityFilter />
    </GenericFilterLayout>
  );
}
