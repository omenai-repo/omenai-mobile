import React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import tw from "twrnc";

const { width: W } = Dimensions.get("window");

/**
 * Web Overview layout: hero block, divider, about, optional rail, roster blocks.
 */
export default function GalleryDetailsSkeleton() {
  return (
    <ScrollView
      style={tw`flex-1`}
      contentContainerStyle={tw`px-4 pb-24`}
      showsVerticalScrollIndicator={false}
    >
      <View style={tw`py-12 border-b border-neutral-100`}>
        <View style={[{ width: "100%", aspectRatio: 4 / 3 }, tw`bg-neutral-100 rounded-sm`]} />
        <View style={tw`mt-6`}>
          <View style={tw`h-3 w-20 bg-neutral-200 rounded-sm`} />
          <View style={[tw`h-8 bg-neutral-200 rounded-sm mt-3`, { width: W * 0.72 }]} />
          <View style={tw`h-3 w-48 bg-neutral-100 rounded-sm mt-4`} />
        </View>
        <View style={tw`h-px bg-neutral-200 my-8`} />
        <View style={tw`h-2.5 w-28 bg-neutral-200 rounded-sm`} />
        <View style={tw`h-3 w-full bg-neutral-100 rounded-sm mt-4`} />
        <View style={tw`h-3 w-full bg-neutral-100 rounded-sm mt-2`} />
        <View style={[tw`h-3 bg-neutral-100 rounded-sm mt-2`, { width: W * 0.7 }]} />
      </View>
      <View style={tw`py-10`}>
        <View style={tw`flex-row justify-between items-end mb-8`}>
          <View style={tw`h-6 w-40 bg-neutral-200 rounded-sm`} />
          <View style={tw`h-3 w-16 bg-neutral-200 rounded-sm`} />
        </View>
        <View style={tw`flex-row`}>
          <View style={tw`flex-1 pr-2`}>
            <View style={[{ width: "100%", aspectRatio: 3 / 2 }, tw`bg-neutral-100 rounded-sm`]} />
            <View style={tw`h-4 w-full bg-neutral-200 rounded-sm mt-3`} />
            <View style={tw`h-2.5 w-24 bg-neutral-100 rounded-sm mt-2`} />
          </View>
          <View style={tw`flex-1 pl-2`}>
            <View style={[{ width: "100%", aspectRatio: 3 / 2 }, tw`bg-neutral-100 rounded-sm`]} />
            <View style={tw`h-4 w-full bg-neutral-200 rounded-sm mt-3`} />
            <View style={tw`h-2.5 w-24 bg-neutral-100 rounded-sm mt-2`} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
