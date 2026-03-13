import React from "react";
import { Feather, Octicons } from "@expo/vector-icons";
import ExtraDetailAccordion from "./ExtraDetailAccordion";
import tw from "twrnc";
import * as WebBrowser from "expo-web-browser";

export default function Coverage() {
  const learnMoreUrl = `${process.env.EXPO_PUBLIC_API_ORIGIN}legal?ent=collector`;

  return (
    <ExtraDetailAccordion
      title="Omenai Guarantee"
      items={[
        {
          text: "Encrypted payment security.",
          icon: <Feather name="lock" size={14} style={tw`text-neutral-500`} />,
        },
        {
          text: "Verified Certificate of Authenticity.",
          icon: (
            <Octicons name="verified" size={14} style={tw`text-neutral-500`} />
          ),
        },
        {
          text: "Learn more",
          onPress: () => {
            WebBrowser.openBrowserAsync(learnMoreUrl);
          },
        },
      ]}
    />
  );
}
