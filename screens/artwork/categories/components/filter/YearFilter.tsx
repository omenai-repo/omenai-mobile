import React from "react";
import GenericYearFilter from "#components/filter/generic/YearFilter";
import { artworkCategoriesStore } from "#store/artwork/artworkCategoriesStore";

export default function YearFilter() {
  const store = artworkCategoriesStore();
  return <GenericYearFilter store={store} />;
}
