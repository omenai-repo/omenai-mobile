import React from "react";
import GenericYearFilter from "components/filter/generic/YearFilter";
import { filterStore } from "store/artworks/FilterStore";

export default function YearFilter() {
  const store = filterStore();
  return <GenericYearFilter store={store} />;
}
