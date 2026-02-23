import React from "react";
import { View, ScrollView } from "react-native";
import SkeletonBox from "./SkeletonBox";
import { TransactionSkeletonCard } from "./TransactionSkeletonCard";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import tw from "twrnc";

export default function PayoutSkeleton({
  withHeader = false,
}: {
  withHeader?: boolean;
}) {
  return (
    <View style={tw`flex-1`}>
      {withHeader && <BackHeaderTitle title="Payout" />}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          paddingHorizontal: withHeader ? 20 : 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`gap-5`}>
          {/* PayoutSummary Skeleton */}
          <SkeletonBox width="100%" height={100} radius={12} />

          {/* BalanceBox Skeleton */}
          <SkeletonBox width="100%" height={280} radius={10} />
        </View>

        {/* Transactions Skeleton Section */}
        <View style={tw`flex-1 pt-5`}>
          <TransactionSkeletonCard count={5} />
        </View>
      </ScrollView>
    </View>
  );
}
