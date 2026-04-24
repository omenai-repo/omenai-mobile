import React, { useMemo } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import tw from "twrnc";

const ROWS = 4;
const COLS = 2;

type Props = {
  horizontalPad?: number;
  cardGap?: number;
};

export default function GalleriesDirectorySkeleton({
  horizontalPad = 20,
  cardGap = 12,
}: Props) {
  const { width: screenW } = Dimensions.get("window");
  const cardW = useMemo(
    () => (screenW - horizontalPad * 2 - cardGap) / 2,
    [screenW, horizontalPad, cardGap],
  );
  const imageH = useMemo(() => (cardW * 3) / 4, [cardW]);

  return (
    <ScrollView
      style={tw`flex-1`}
      contentContainerStyle={tw`pb-16`}
      showsVerticalScrollIndicator={false}
    >
      <View style={[{ paddingHorizontal: horizontalPad }, tw`pt-1`]}>
        <View style={tw`border-b border-neutral-100 pb-10 mb-2`}>
          <View style={[tw`h-9 bg-neutral-200 rounded-sm`, { width: screenW * 0.55 }]} />
          <View style={tw`h-3 w-48 bg-neutral-100 rounded-sm mt-4`} />
        </View>

        {Array.from({ length: ROWS }).map((_, row) => (
          <View
            key={`row-${row}`}
            style={[
              tw`flex-row`,
              { marginBottom: 24, columnGap: cardGap, justifyContent: "space-between" },
            ]}
          >
            {Array.from({ length: COLS }).map((__, col) => (
              <View key={`cell-${row}-${col}`} style={[{ width: cardW }]}>
                <View
                  style={[
                    tw`bg-neutral-100 rounded-sm overflow-hidden`,
                    { width: cardW, height: imageH },
                  ]}
                />
                <View style={tw`mt-3 flex-row items-center justify-between`}>
                  <View style={tw`flex-1 pr-2`}>
                    <View style={tw`h-3.5 w-full max-w-[120px] bg-neutral-200 rounded-sm`} />
                    <View style={tw`h-2.5 w-20 bg-neutral-100 rounded-sm mt-2`} />
                  </View>
                  <View style={tw`h-8 w-20 bg-neutral-100 rounded-full`} />
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
