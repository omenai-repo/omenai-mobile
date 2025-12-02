import React from "react";
import GenericPriceFilter from "components/filter/generic/PriceFilter";
import { artworkCategoriesStore } from "store/artworks/ArtworkCategoriesStore";

export default function PriceFilter() {
  const store = artworkCategoriesStore();
  return <GenericPriceFilter store={store} />;
}
