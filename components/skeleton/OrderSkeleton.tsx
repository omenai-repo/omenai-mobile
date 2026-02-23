import React from "react";
import { View, Dimensions } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";

const { width: screenWidth } = Dimensions.get("window");

/**
 * Skeleton loader for Purchase/Order screens.
 * Mimics the order summary layout with artwork image, details, and pricing.
 */
export default function OrderSkeleton() {
  return (
    <View style={tw`flex-1 bg-white px-5 pt-4`}>
      {/* Artwork Image */}
      <View style={tw`items-center mb-6`}>
        <Skeleton
          colorMode="light"
          height={200}
          width={screenWidth - 40}
          radius={12}
        />
      </View>

      {/* Order Details Card */}
      <View style={tw`bg-gray-50 rounded-md p-4 mb-6`}>
        {/* Title */}
        <View style={tw`mb-3`}>
          <Skeleton colorMode="light" height={20} width="70%" radius={4} />
        </View>

        {/* Artist */}
        <View style={tw`mb-4`}>
          <Skeleton colorMode="light" height={14} width="40%" radius={4} />
        </View>

        {/* Separator */}
        <View style={tw`h-[1px] bg-gray-200 w-full my-3`} />

        {/* Price rows */}
        <View style={tw`flex-row justify-between mb-2`}>
          <Skeleton colorMode="light" height={14} width={80} radius={4} />
          <Skeleton colorMode="light" height={14} width={70} radius={4} />
        </View>
        <View style={tw`flex-row justify-between mb-2`}>
          <Skeleton colorMode="light" height={14} width={60} radius={4} />
          <Skeleton colorMode="light" height={14} width={50} radius={4} />
        </View>
        <View style={tw`flex-row justify-between mb-2`}>
          <Skeleton colorMode="light" height={14} width={40} radius={4} />
          <Skeleton colorMode="light" height={14} width={40} radius={4} />
        </View>

        {/* Total */}
        <View style={tw`h-[1px] bg-gray-200 w-full my-3`} />
        <View style={tw`flex-row justify-between`}>
          <Skeleton colorMode="light" height={18} width={50} radius={4} />
          <Skeleton colorMode="light" height={18} width={90} radius={4} />
        </View>
      </View>

      {/* Action Button */}
      <View style={tw`mt-4`}>
        <Skeleton colorMode="light" height={48} width="100%" radius={8} />
      </View>
    </View>
  );
}
