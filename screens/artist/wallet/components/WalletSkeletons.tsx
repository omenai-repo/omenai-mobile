import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import tw from "twrnc";

const SkeletonBlock = ({
  style,
  duration = 800,
}: {
  style: any;
  duration?: number;
}) => (
  <MotiView
    from={{ opacity: 0.3 }}
    animate={{ opacity: 1 }}
    transition={{ loop: true, type: "timing", duration }}
    style={[tw`bg-[#E7E7E7] rounded-md`, style]}
  />
);

export const WalletContainerSkeleton = () => {
  return (
    <View
      style={tw`bg-white border flex-row items-center p-[15px] mx-5 border-neutral-100 rounded-md`}
    >
      <View style={tw`flex-row items-center gap-[15px] flex-1`}>
        <SkeletonBlock style={tw`w-12 h-12 rounded-md`} />
        <View style={tw`gap-[5px]`}>
          <SkeletonBlock style={tw`w-[150px] h-4`} />
          <SkeletonBlock style={tw`w-[100px] h-4`} />
        </View>
      </View>
      <SkeletonBlock style={tw`w-[80px] h-4`} />
    </View>
  );
};

export const AccountDetailsSkeleton = () => {
  return (
    <View style={tw`mt-5`}>
      <View
        style={tw`bg-white border border-neutral-100 rounded-md px-5 py-3.5 mb-5`}
      >
        <SkeletonBlock style={tw`w-[120px] h-4 mb-2`} duration={1000} />
        <View style={tw`flex-row items-center gap-5 mt-2`}>
          <SkeletonBlock style={tw`flex-1 h-4`} duration={1000} />
          <SkeletonBlock style={tw`w-[100px] h-4`} duration={1000} />
        </View>
      </View>
    </View>
  );
};
