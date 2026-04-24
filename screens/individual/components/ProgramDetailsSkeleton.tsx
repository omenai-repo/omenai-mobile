import React, { useMemo } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";

const SKELETON_CARDS = [0, 1, 2, 3] as const;
const { width: SCREEN_W } = Dimensions.get("window");
const H_PAD = 20;
const GAP = 8;
const CARD_W = (SCREEN_W - H_PAD * 2 - GAP) / 2;
const CARD_H = (CARD_W * 5) / 4;

export type ProgramDetailsKind = "show" | "fair_event";

function backTitleFor(kind: ProgramDetailsKind) {
  return kind === "show" ? "Show Details" : "Event Details";
}

type Props = {
  kind: ProgramDetailsKind;
};

export default function ProgramDetailsSkeleton({ kind }: Props) {
  const { height: screenH } = Dimensions.get("window");
  const heroHeight = useMemo(() => Math.min(screenH * 0.5, 320), [screenH]);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title={backTitleFor(kind)} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-10`}
        bounces={false}
      >
        <View
          style={[
            tw`w-full bg-neutral-100`,
            { minHeight: heroHeight },
          ]}
        />

        <View style={tw`px-5 py-8`}>
          <View style={tw`flex-col`}>
            <View style={tw`w-full`}>
              <View style={tw`w-24 h-3 bg-neutral-200 rounded-sm`} />
              <View style={tw`w-full h-9 bg-neutral-200 rounded-sm mt-3`} />
              <View style={tw`w-40 h-3 bg-neutral-100 rounded-sm mt-4`} />
            </View>
            <View style={tw`w-full mt-8`}>
              <View style={tw`w-full h-3 bg-neutral-100 rounded-sm`} />
              <View style={tw`w-full h-3 bg-neutral-100 rounded-sm mt-2`} />
              <View
                style={[
                  tw`h-3 bg-neutral-100 rounded-sm mt-2`,
                  { width: (SCREEN_W - 40) * 0.65 },
                ]}
              />
            </View>
          </View>
        </View>

        <View
          style={[
            tw`px-5 flex-row flex-wrap justify-between`,
            { columnGap: GAP, rowGap: GAP },
          ]}
        >
          {SKELETON_CARDS.map((i) => (
            <View
              key={i}
              style={[
                tw`bg-neutral-50 rounded-sm`,
                { width: CARD_W, height: CARD_H, marginBottom: 8 },
              ]}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
