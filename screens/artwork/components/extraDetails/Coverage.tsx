import React from "react";
import { Feather, Octicons } from "@expo/vector-icons";
import ExtraDetailAccordion from "./ExtraDetailAccordion";
import tw from "twrnc";
import { useModalStore } from "#store/modal/modalStore";

export default function Coverage() {
  const { setWebViewUrl } = useModalStore();
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
          hasLeftBorder: true,
          onPress: () => setWebViewUrl(learnMoreUrl),
        },
      ]}
    />
  );
}
