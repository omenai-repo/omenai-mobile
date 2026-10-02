import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";

const colorMode = "light" as const;

/** A single labeled input field skeleton */
const FieldSkeleton = ({ height = 44 }: { height?: number }) => (
  <View style={tw`mb-1`}>
    <Skeleton colorMode={colorMode} height={13} width={110} radius={4} />
    <View style={tw`mt-2`}>
      <Skeleton colorMode={colorMode} height={height} width="100%" radius={6} />
    </View>
  </View>
);

export default function UploadArtworkSkeleton() {
  return (
    <View style={tw`flex-1 px-5 pt-6`}>
      {/* Step indicator dots */}
      <View style={tw`flex-row gap-2 mb-8 justify-center`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            colorMode={colorMode}
            height={8}
            width={i === 0 ? 24 : 8}
            radius={4}
          />
        ))}
      </View>

      <View style={tw`gap-5 mb-12`}>
        {/* Title */}
        <FieldSkeleton />

        {/* Description textarea */}
        <FieldSkeleton height={90} />

        {/* Medium dropdown */}
        <FieldSkeleton />

        {/* Materials textarea */}
        <FieldSkeleton height={90} />

        {/* Year */}
        <FieldSkeleton />

        {/* Rarity + Certificate row */}
        <View style={tw`flex-row gap-5`}>
          <View style={tw`flex-1`}>
            <FieldSkeleton />
          </View>
          <View style={tw`flex-1`}>
            <FieldSkeleton />
          </View>
        </View>

        {/* Signature dropdown */}
        <FieldSkeleton />
      </View>

      {/* Proceed button */}
      <Skeleton colorMode={colorMode} height={50} width="100%" radius={6} />
    </View>
  );
}
