import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { billingTabs } from "../Billing";
import { colors } from "#config/colors.config";
import tw from "twrnc";

type BillingHeaderProps = {
  selectedTab: billingTabs;
  handleUpdate: (tab: billingTabs) => void;
};

export default function Header({ selectedTab, handleUpdate }: BillingHeaderProps) {
  const tabs: billingTabs[] = ["monthly", "yearly"];

  return (
    <View style={tw`px-1 py-1 flex-row items-center gap-1.5 bg-white border border-[#DDD8D0] rounded-md`}>
      {tabs.map((tab: billingTabs, index: number) => (
        <TouchableOpacity
          onPress={() => handleUpdate(tab)}
          key={index}
          style={tw`h-[38px] flex-1`}
          activeOpacity={0.9}
        >
          <View
            style={[
              tw`h-full w-full bg-white rounded-md items-center justify-center`,
              selectedTab === tab && { backgroundColor: colors.black },
            ]}
          >
            <Text
              style={[
                tw`uppercase tracking-[1.4px] text-[11px]`,
                selectedTab === tab ? tw`text-white` : tw`text-[#8A8580]`,
              ]}
            >
              {tab === "monthly" ? "Monthly" : "Annual"}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}