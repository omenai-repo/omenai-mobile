import React from "react";
import GenericRarityFilter from "components/filter/generic/RarityFilter";
import { artworkCategoriesStore } from "store/artworks/ArtworkCategoriesStore";

export default function RarityFilter() {
  const store = artworkCategoriesStore();
  return <GenericRarityFilter store={store} />;
}
