import React from "react";
import GenericRarityFilter from "#components/filter/generic/RarityFilter";
import { artworksMediumFilterStore } from "#store/artwork/artworksMediumFilterStore";

export default function RarityFilter() {
  const store = artworksMediumFilterStore();
  return <GenericRarityFilter store={store} />;
}
