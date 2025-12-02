import React from "react";
import GenericYearFilter from "components/filter/generic/YearFilter";
import { artworksMediumFilterStore } from "store/artworks/ArtworksMediumFilterStore";

export default function YearFilter() {
  const store = artworksMediumFilterStore();
  return <GenericYearFilter store={store} />;
}
