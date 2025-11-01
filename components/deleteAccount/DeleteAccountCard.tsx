import React from "react";
import { View, ViewStyle } from "react-native";
import tw from "twrnc";

type DeleteAccountCardProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function DeleteAccountCard({
  children,
  style,
}: DeleteAccountCardProps) {
  return (
    <View
      style={[
        tw`bg-white rounded-2xl p-5 mb-6`,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.02,
          shadowRadius: 4,
          elevation: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

