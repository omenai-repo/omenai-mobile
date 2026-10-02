import React from "react";
import { Text, Pressable, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";

const TAB_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "RESOLVED", label: "History" },
] as const;

export type ReviewHubTab = (typeof TAB_OPTIONS)[number]["value"];

type ReviewHubTabsProps = {
  activeTab: ReviewHubTab;
  onTabChange: (value: ReviewHubTab) => void;
};

export default function ReviewHubTabs({
  activeTab,
  onTabChange,
}: Readonly<ReviewHubTabsProps>) {
  return (
    <View
      style={tw`flex-row items-start border-b border-neutral-200 mt-3 mb-4`}
    >
      {TAB_OPTIONS.map((tab, index) => {
        const isActive = tab.value === activeTab;

        return (
          <Pressable
            key={tab.value}
            onPress={() => onTabChange(tab.value)}
            style={tw`pt-0.5 ${index === 0 ? "pr-8" : ""}`}
          >
            <View style={tw`h-[30px] justify-center`}>
              <Text
                style={[
                  tw`text-base font-sans-medium`,
                  { color: isActive ? colors.black : colors.grey },
                ]}
              >
                {tab.label}
              </Text>
            </View>
            <View
              style={[
                tw`h-[2px] rounded-full mt-1`,
                {
                  backgroundColor: isActive ? colors.black : "transparent",
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
