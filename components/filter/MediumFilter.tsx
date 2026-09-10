import React from "react";
import GenericMediumFilter from "#components/filter/generic/MediumFilter";
import { filterStore } from "#store/artwork/filterStore";

export default function MediumFilter() {
  const store = filterStore();
  return <GenericMediumFilter store={store} />;
}
