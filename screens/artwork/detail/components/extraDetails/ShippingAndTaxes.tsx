import React from "react";
import ExtraDetailAccordion from "./ExtraDetailAccordion";

export default function ShippingAndTaxes() {
  return (
    <ExtraDetailAccordion
      title="Shipping & taxes"
      items={[
        {
          text: "Shipping calculated at checkout.",
          hasLeftBorder: true,
        },
        {
          text: "Duties and taxes may apply.",
          hasLeftBorder: true,
        },
      ]}
    />
  );
}
