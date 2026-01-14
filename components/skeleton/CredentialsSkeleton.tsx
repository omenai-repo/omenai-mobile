import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";

type CredentialsSkeletonProps = {
  colorMode?: "light" | "dark";
};

/**
 * Skeleton loader for ViewCredentials and EditCredentials screens.
 * Mimics the layout of credential items in a card container.
 */
export default function CredentialsSkeleton({
  colorMode = "light",
}: CredentialsSkeletonProps) {
  const SkeletonItem = () => (
    <View style={tw`mb-4`}>
      <Skeleton colorMode={colorMode} height={14} width={120} radius={4} />
      <View style={tw`mt-2`}>
        <Skeleton colorMode={colorMode} height={42} width="100%" radius={10} />
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      {/* Header skeleton */}
      <View style={tw`h-[60px]`} />

      <View
        style={tw`bg-white border border-[#E7E7E7] rounded-[23px] p-5 mx-5 mt-10`}
      >
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
      </View>
    </View>
  );
}
