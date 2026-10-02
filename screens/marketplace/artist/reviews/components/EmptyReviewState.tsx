import React from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";

type EmptyReviewStateProps = {
  tab: "ACTIVE" | "RESOLVED";
};

export default function EmptyReviewState({
  tab,
}: Readonly<EmptyReviewStateProps>) {
  const title = `No ${tab.toLowerCase()} proposals`;
  const description =
    tab === "ACTIVE"
      ? "When you propose a price outside the standard algorithm, its status will appear here."
      : "Your approved and declined proposals will be logged here for future reference.";

  return (
    <View
      style={tw`mt-2 rounded-2xl border border-slate-200 bg-slate-50 min-h-[500px] px-6 py-10 overflow-hidden`}
    >
      <View style={tw`flex-1 items-center justify-center`}>
        <View
          style={tw`p-4 rounded-3xl bg-white items-center justify-center border border-slate-200 shadow-sm`}
        >
          <Feather name="clock" size={40} color={tw.color("slate-500")} />
        </View>

        <Text
          style={tw`mt-7 text-2xl leading-8 font-sans-semibold text-center text-slate-900`}
        >
          {title}
        </Text>

        <Text
          style={tw`mt-3 text-base leading-7 font-sans-medium text-center text-slate-500 max-w-[92%]`}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}
