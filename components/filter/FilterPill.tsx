import React from "react";
import { filterStore } from "#store/artwork/filterStore";
import { artworkStore } from "#store/artwork/artworkStore";
import { artworkActionStore } from "#store/artwork/artworkActionStore";
import { fetchPaginatedArtworks } from "#services/artwork/fetchPaginatedArtworks";
import GenericFilterPill from "#components/filter/generic/FilterPill";

export default function FilterPill({ filter }: { filter: string }) {
  const { removeSingleFilterSelection, selectedFilters } = filterStore();
  const { setArtworks, setIsLoading, setPageCount } = artworkStore();
  const { paginationCount } = artworkActionStore();

  const handleRemoveSingleFilter = async () => {
    setIsLoading(true);
    if (selectedFilters.length === 1) {
      removeSingleFilterSelection(filter);
      const response = await fetchPaginatedArtworks(paginationCount, {
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
