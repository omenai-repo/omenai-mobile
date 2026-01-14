import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";

type FormSkeletonProps = {
  colorMode?: "light" | "dark";
  rows?: number;
};

/**
 * Generic form skeleton for loading states in form screens.
 * Used for ForgotPin, AddPrimaryAcct, ArtworkPriceReview, etc.
 */
export default function FormSkeleton({
  colorMode = "light",
  rows = 4,
}: FormSkeletonProps) {
  const FormFieldSkeleton = () => (
    <View style={tw`mb-5`}>
      <Skeleton colorMode={colorMode} height={14} width={100} radius={4} />
      <View style={tw`mt-2`}>
        <Skeleton colorMode={colorMode} height={48} width="100%" radius={8} />
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-[#F7F7F7] justify-center items-center px-5`}>
      <View style={tw`bg-white rounded-[20px] p-5 w-full`}>
        {/* Title skeleton */}
        <View style={tw`mb-6`}>
          <Skeleton colorMode={colorMode} height={24} width="60%" radius={4} />
        </View>

        {/* Form fields skeleton */}
        {Array.from({ length: rows }).map((_, index) => (
          <FormFieldSkeleton key={index} />
        ))}

        {/* Button skeleton */}
        <View style={tw`mt-4`}>
          <Skeleton colorMode={colorMode} height={48} width="100%" radius={8} />
        </View>
      </View>
    </View>
  );
}
