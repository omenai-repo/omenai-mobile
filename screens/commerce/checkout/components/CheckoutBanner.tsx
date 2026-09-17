import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

export const CheckoutBanner = ({
  actionLabel,
  planName,
  interval,
}: {
  actionLabel: string;
  planName: string;
  interval: string;
}) => (
  <View style={tw`rounded-sm bg-slate-900 p-5 mb-4`}>
    <Text style={tw`text-[10px] uppercase tracking-widest text-slate-300 mb-2`}>
      Subscription {actionLabel}
    </Text>
    <Text style={tw`text-xl font-bold text-white mb-1`}>
      Omenai {planName} subscription
    </Text>
    <Text style={tw`text-[12px] text-slate-300`}>Billed {interval}</Text>
  </View>
);
