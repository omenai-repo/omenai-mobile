import React from "react";
import GenericRarityFilter from "#components/filter/generic/RarityFilter";
import { filterStore } from "#store/artwork/filterStore";

export default function RarityFilter() {
  const store = filterStore();
  return <GenericRarityFilter store={store} />;
}
