import React from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";

const BODY_LINES: { width: `${number}%` | number; key: string }[] = [
  { key: "b1", width: "100%" },
  { key: "b2", width: "100%" },
  { key: "b3", width: "96%" },
  { key: "b4", width: "100%" },
  { key: "b5", width: "88%" },
  { key: "b6", width: "100%" },
  { key: "b7", width: "72%" },
  { key: "b8", width: "100%" },
  { key: "b9", width: "92%" },
];

type Props = {
  contentTopInset: number;
};

/**
 * Layout mirror of ArticleScreen while the full editorial row is loading.
 */
export default function ArticleDetailSkeleton({
  contentTopInset,
}: Readonly<Props>) {
  const { width } = useWindowDimensions();

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: contentTopInset, paddingBottom: 50 }}
      >
        <Skeleton
          colorMode="light"
          height={320}
          width={width}
          radius={0}
        />

        <View style={tw`px-5 mt-4 gap-3`}>
          <Skeleton colorMode="light" height={28} width="92%" radius={4} />
          <Skeleton colorMode="light" height={28} width="64%" radius={4} />
          <Skeleton colorMode="light" height={22} width="100%" radius={4} />
        </View>

        <View style={tw`px-5 mt-6 gap-3`}>
          {BODY_LINES.map(({ key, width: w }) => (
            <Skeleton
              key={key}
              colorMode="light"
              height={14}
              width={w}
              radius={4}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
