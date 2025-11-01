import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";

export default function DeleteAccountHeader() {
  return (
    <View style={tw`mb-5 flex-row items-center gap-3`}>
      <View
        style={[
          tw`w-12 h-12 rounded-full items-center justify-center flex-shrink-0`,
          { backgroundColor: "rgba(255, 0, 0, 0.1)" },
        ]}
      >
        <Text style={tw`text-4xl text-red-500`}>☹︎</Text>
      </View>
      <View style={tw`flex-1`}>
        <Text
          style={tw`text-2xl font-bold leading-[34px] text-[${colors.primary_black}]`}
        >
          Delete your account
        </Text>
        <Text style={tw`leading-6 text-[${colors.grey}]`}>
          You&apos;ll lose access to Omenai app.
        </Text>
      </View>
    </View>
  );
}
