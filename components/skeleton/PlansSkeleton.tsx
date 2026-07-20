import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import tw from "twrnc";

/**
 * Skeleton loader for Billing/Plans screen.
 * Mimics the plan cards layout.
 */
const PlanCard = () => (
  <View style={tw`bg-white rounded-sm p-5 border border-gray-200 mb-4`}>
    {/* Plan name */}
    <View style={tw`mb-3`}>
      <Skeleton colorMode="light" height={24} width={120} radius={4} />
    </View>

    {/* Price */}
    <View style={tw`mb-4`}>
      <Skeleton colorMode="light" height={32} width={100} radius={4} />
    </View>

    {/* Features */}
    <View style={tw`gap-2 mb-4`}>
      <View style={tw`flex-row items-center gap-2`}>
        <Skeleton colorMode="light" height={16} width={16} radius={8} />
        <Skeleton colorMode="light" height={14} width="70%" radius={4} />
      </View>
      <View style={tw`flex-row items-center gap-2`}>
        <Skeleton colorMode="light" height={16} width={16} radius={8} />
        <Skeleton colorMode="light" height={14} width="60%" radius={4} />
      </View>
      <View style={tw`flex-row items-center gap-2`}>
        <Skeleton colorMode="light" height={16} width={16} radius={8} />
        <Skeleton colorMode="light" height={14} width="80%" radius={4} />
      </View>
    </View>

    {/* Button */}
    <Skeleton colorMode="light" height={44} width="100%" radius={8} />
  </View>
);

export default function PlansSkeleton({ noStyle }: { noStyle?: boolean }) {
  return (
    <View style={noStyle ? undefined : tw`px-5 pt-4`}>
      <PlanCard />
      <PlanCard />
      <PlanCard />
    </View>
  );
}
