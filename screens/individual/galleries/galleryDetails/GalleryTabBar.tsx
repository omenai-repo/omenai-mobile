import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";

export type GalleryTabId = "overview" | "works" | "shows" | "artists" | "contact";

const TABS: { id: GalleryTabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "works", label: "Works" },
  { id: "shows", label: "Shows, Events & Fairs" },
  { id: "artists", label: "Artists" },
  { id: "contact", label: "Contact" },
];

type Props = {
  active: GalleryTabId;
  onSelect: (id: GalleryTabId) => void;
};

export default function GalleryTabBar({ active, onSelect }: Props) {
  return (
    <View style={tw`bg-white/95 border-b border-neutral-200`}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-2 pb-0`}
        nestedScrollEnabled
      >
        {TABS.map((tab) => {
          const isOn = active === tab.id;
          return (
            <Pressable key={tab.id} onPress={() => onSelect(tab.id)}>
              {({ pressed }) => (
                <View style={tw`px-3 py-4 mr-1 min-h-[48px] justify-center`}>
                  <Text
                    style={[
                      tw`text-xs uppercase tracking-[0.15em] font-sans-regular`,
                      isOn ? tw`text-neutral-900` : tw`text-neutral-500`,
                      pressed && !isOn && tw`text-neutral-700`,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {isOn ? (
                    <View style={tw`mt-1 h-0.5 w-full bg-neutral-900`} />
                  ) : (
                    <View style={tw`mt-1 h-0.5 w-full bg-transparent`} />
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
