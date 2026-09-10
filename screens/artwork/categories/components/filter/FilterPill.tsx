import React from "react";
import { fetchPaginatedArtworks } from "#services/artwork/fetchPaginatedArtworks";
import { artworkCategoriesStore } from "#store/artwork/artworkCategoriesStore";
import GenericFilterPill from "#components/filter/generic/FilterPill";

export default function FilterPill({ filter }: { filter: string }) {
  const {
    setArtworks,
    setIsLoading,
    setPageCount,
    pageCount,
    selectedFilters,
    removeSingleFilterSelection,
  } = artworkCategoriesStore();

  const handleRemoveSingleFilter = async () => {
    setIsLoading(true);
    if (selectedFilters.length === 1) {
      removeSingleFilterSelection(filter);
      const response = await fetchPaginatedArtworks(pageCount, {
        price: [],
        year: [],
        medium: [],
        rarity: [],
      });
      if (response?.isOk) {
        setArtworks(response.data);
        setPageCount(response.count);
      }
    } else {
      removeSingleFilterSelection(filter);
    }

    setIsLoading(false);
  };

  return (
    <GenericFilterPill filter={filter} onRemove={handleRemoveSingleFilter} />
  );
}
