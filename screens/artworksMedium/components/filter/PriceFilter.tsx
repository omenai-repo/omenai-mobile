import React from "react";
import GenericPriceFilter from "components/filter/generic/PriceFilter";
import { artworksMediumFilterStore } from "store/artworks/ArtworksMediumFilterStore";

export default function PriceFilter() {
  const store = artworksMediumFilterStore();
  return <GenericPriceFilter store={store} />;
}
