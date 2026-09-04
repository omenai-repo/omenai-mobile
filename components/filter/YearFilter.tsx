import React from "react";
import GenericYearFilter from "#components/filter/generic/YearFilter";
import { filterStore } from "#store/artwork/filterStore";

export default function YearFilter() {
  const store = filterStore();
  return <GenericYearFilter store={store} />;
}
