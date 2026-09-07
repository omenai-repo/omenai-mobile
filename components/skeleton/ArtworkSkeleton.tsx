import React from "react";
import { View, Dimensions } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";

const { width: screenWidth } = Dimensions.get("window");

export default function ArtworkSkeleton() {
  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Image placeholder */}
      <View style={tw`items-center`}>
        <Skeleton colorMode="light" height={300} width={screenWidth} />
      </View>

      <View style={tw`px-5 pt-8`}>
        {/* Title */}
        <View style={tw`mb-3`}>
          <Skeleton colorMode="light" height={36} width="80%" radius={2} />
        </View>

        {/* Artist name */}
        <View style={tw`mb-6`}>
          <Skeleton colorMode="light" height={20} width="50%" radius={2} />
        </View>

        {/* Medium / Year / Rarity (Artwork Details) */}
        <View
          style={tw`flex-row gap-3 mb-6 items-center py-4 border-t border-b border-slate-100 mt-2`}
        >
          <Skeleton colorMode="light" height={14} width={50} radius={2} />
          <View style={tw`h-3 w-[1px] bg-slate-200`} />
          <Skeleton colorMode="light" height={14} width={40} radius={2} />
          <View style={tw`h-3 w-[1px] bg-slate-200`} />
          <Skeleton colorMode="light" height={14} width={80} radius={2} />
        </View>

        {/* Physical Specifications */}
        <View
          style={tw`bg-[#F9F9F9] px-3 py-4 mb-6 border-[0.5px] border-neutral-100`}
        >
          <View style={tw`mb-4`}>
            <Skeleton colorMode="light" height={16} width={150} radius={2} />
          </View>
          <View style={tw`flex-row items-center gap-4`}>
            <Skeleton colorMode="light" height={24} width="28%" radius={2} />
            <Skeleton colorMode="light" height={24} width="28%" radius={2} />
          </View>
        </View>

        {/* Price value */}
        <View style={tw`mb-6`}>
          <Skeleton colorMode="light" height={28} width={120} radius={2} />
        </View>

        {/* Purchase/Request button */}
        <View style={tw`mb-4`}>
          <Skeleton colorMode="light" height={46} width="100%" radius={2} />
        </View>

        {/* Save button & AR button row */}
        <View style={tw`flex-row gap-5 mb-8 w-full`}>
          <View style={tw`flex-1`}>
            <Skeleton colorMode="light" height={46} width="100%" radius={2} />
          </View>
          <Skeleton colorMode="light" height={46} width={46} radius={2} />
        </View>

        {/* Extra cards (Shipping / Coverage) */}
        <View style={tw`flex-col gap-4`}>
          <Skeleton colorMode="light" height={80} width="100%" radius={2} />
          <Skeleton colorMode="light" height={80} width="100%" radius={2} />
        </View>
      </View>
    </View>
  );
}
