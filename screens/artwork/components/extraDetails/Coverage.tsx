import React from "react";
import { Feather, Octicons } from "@expo/vector-icons";
import ExtraDetailAccordion from "./ExtraDetailAccordion";
import tw from "twrnc";

export default function Coverage() {
  return (
    <ExtraDetailAccordion
      title="Omenai Guarantee"
      items={[
        {
          text: "Secure Checkout",
          icon: <Feather name="lock" size={14} style={tw`text-neutral-500`} />,
        },
        {
          text: "Authenticity Guarantee",
          icon: (
            <Octicons name="verified" size={14} style={tw`text-neutral-500`} />
          ),
        },
      ]}
    />
  );
}
