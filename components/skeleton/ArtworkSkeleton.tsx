import React from "react";
import { View, Dimensions } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";

const { width: screenWidth } = Dimensions.get("window");

/**
 * Skeleton loader for the Artwork details screen.
 * Mimics the artwork image, title, artist, price, and buttons layout.
 */
export default function ArtworkSkeleton() {
  return (
    <View style={tw`flex-1 bg-white px-5`}>
      {/* Image placeholder */}
      <View style={tw`items-center mb-6`}>
        <Skeleton
          colorMode="light"
          height={300}
          width={screenWidth - 40}
          radius={8}
        />
      </View>

      {/* Title */}
      <View style={tw`mb-2`}>
        <Skeleton colorMode="light" height={28} width="80%" radius={4} />
      </View>

      {/* Artist name */}
      <View style={tw`mb-2`}>
        <Skeleton colorMode="light" height={18} width="50%" radius={4} />
      </View>

      {/* Tags */}
      <View style={tw`mb-5`}>
        <Skeleton colorMode="light" height={14} width="40%" radius={4} />
      </View>

      {/* Price label */}
      <View style={tw`mb-2`}>
        <Skeleton colorMode="light" height={14} width={60} radius={4} />
      </View>

      {/* Price value */}
      <View style={tw`mb-6`}>
        <Skeleton colorMode="light" height={22} width={120} radius={4} />
      </View>

      {/* Tags row */}
      <View style={tw`flex-row gap-3 mb-8`}>
        <Skeleton colorMode="light" height={36} width={180} radius={20} />
        <Skeleton colorMode="light" height={36} width={140} radius={20} />
      </View>

      {/* Purchase button */}
      <View style={tw`mb-4`}>
        <Skeleton colorMode="light" height={48} width="100%" radius={8} />
      </View>

      {/* Save button */}
      <View style={tw`mb-6`}>
        <Skeleton colorMode="light" height={48} width="100%" radius={8} />
      </View>

      {/* More details link */}
      <View style={tw`items-center mb-10`}>
        <Skeleton colorMode="light" height={16} width={200} radius={4} />
      </View>

      {/* Extra cards */}
      <View style={tw`flex-row gap-4`}>
        <View style={tw`flex-1`}>
          <Skeleton colorMode="light" height={100} width="100%" radius={12} />
        </View>
        <View style={tw`flex-1`}>
          <Skeleton colorMode="light" height={100} width="100%" radius={12} />
        </View>
      </View>
    </View>
  );
}
