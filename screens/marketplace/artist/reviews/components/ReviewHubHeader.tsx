import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

import ReviewHubTabs, { type ReviewHubTab } from "./ReviewHubTabs";

type ReviewHubHeaderProps = {
  activeTab: ReviewHubTab;
  onTabChange: (value: ReviewHubTab) => void;
  topInset: number;
};

export default function ReviewHubHeader({
  activeTab,
  onTabChange,
  topInset,
}: Readonly<ReviewHubHeaderProps>) {
  return (
    <View style={[tw`px-4 pb-2 bg-white`, { paddingTop: topInset + 8 }]}>
      <View>
        <Text style={tw`text-2xl font-sans-medium text-slate-900`}>
          Pricing Proposals
        </Text>
        <Text style={tw`text-base font-sans-regular text-slate-500 mt-1`}>
          Track and manage your requested pricing overrides.
        </Text>
      </View>

      <ReviewHubTabs activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}
