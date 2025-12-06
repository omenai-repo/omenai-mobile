import React from "react";
import GenericMediumFilter from "components/filter/generic/MediumFilter";
import { artworkCategoriesStore } from "store/artworks/ArtworkCategoriesStore";

const options = [
  "Acrylic",
  "Oil",
  "Fabric",
  "Mixed media",
  "Ink",
  "Collage or other works on paper",
  "Ankara",
  "Photography",
  "Charcoal",
  "Canvas",
  "Paper",
  "Other",
];

export default function MediumFilter() {
  const store = artworkCategoriesStore();
  return <GenericMediumFilter store={store} customOptions={options} />;
}
