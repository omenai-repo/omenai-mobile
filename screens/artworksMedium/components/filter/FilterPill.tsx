import React from "react";
import { artworkActionStore } from "store/artworks/ArtworkActionStore";
import { fetchPaginatedArtworks } from "services/artworks/fetchPaginatedArtworks";
import { artworksMediumStore } from "store/artworks/ArtworksMediumsStore";
import { artworksMediumFilterStore } from "store/artworks/ArtworksMediumFilterStore";
import GenericFilterPill from "components/filter/generic/FilterPill";

export default function FilterPill({ filter }: { filter: string }) {
  const { removeSingleFilterSelection, selectedFilters } =
    artworksMediumFilterStore();
  const { setArtworks, setIsLoading, setPageCount, medium } =
    artworksMediumStore();
  const { paginationCount, updatePaginationCount } = artworkActionStore();

  const handleRemoveSingleFilter = async () => {
    setIsLoading(true);
    if (selectedFilters.length === 1) {
      removeSingleFilterSelection(filter);
      const response = await fetchPaginatedArtworks(paginationCount, {
        price: [],
        year: [],
        medium: [medium],
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
