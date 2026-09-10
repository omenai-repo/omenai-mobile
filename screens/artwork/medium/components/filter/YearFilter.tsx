import React from "react";
import GenericYearFilter from "#components/filter/generic/YearFilter";
import { artworksMediumFilterStore } from "#store/artwork/artworksMediumFilterStore";

export default function YearFilter() {
  const store = artworksMediumFilterStore();
  return <GenericYearFilter store={store} />;
}
