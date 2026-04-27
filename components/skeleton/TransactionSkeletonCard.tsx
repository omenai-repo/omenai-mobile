import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import tw from "twrnc";

const pulse = {
  from: { opacity: 0.4 },
  animate: { opacity: 1 },
  transition: { loop: true, type: "timing", duration: 800 } as const,
};

export const TransactionRowSkeleton = () => (
  <View
    style={tw`flex-row items-center px-4 py-3.5 border-b border-neutral-100`}
  >
    <MotiView {...pulse} style={tw`w-10 h-10 rounded-full bg-gray-200 mr-3`} />
    <View style={tw`flex-1 gap-[6px]`}>
      <MotiView {...pulse} style={tw`h-[13px] w-[140px] rounded bg-gray-200`} />
      <MotiView {...pulse} style={tw`h-[11px] w-[90px] rounded bg-gray-100`} />
    </View>
    <View style={tw`items-end gap-[5px]`}>
      <MotiView {...pulse} style={tw`h-[13px] w-[60px] rounded bg-gray-200`} />
      <MotiView
        {...pulse}
        style={tw`h-[10px] w-[50px] rounded-full bg-gray-100`}
      />
    </View>
  </View>
);

interface TransactionSkeletonCardProps {
  count?: number;
  style?: object;
}

export const TransactionSkeletonCard = ({
  count = 7,
  style,
}: Readonly<TransactionSkeletonCardProps>) => {
  const skeletonItems = React.useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => `transaction-skeleton-${i}`),
    [count],
  );

  return (
    <View
      style={[
        tw`bg-white rounded-sm border border-neutral-100 overflow-hidden`,
        style,
      ]}
    >
      {skeletonItems.map((key) => (
        <TransactionRowSkeleton key={key} />
      ))}
    </View>
  );
};
