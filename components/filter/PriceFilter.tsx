import React from "react";
import GenericPriceFilter from "components/filter/generic/PriceFilter";
import { filterStore } from "store/artworks/FilterStore";

export default function PriceFilter() {
  const store = filterStore();
  return <GenericPriceFilter store={store} />;
}
