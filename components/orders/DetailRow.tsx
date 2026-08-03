import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface DetailRowProps {
  label: string;
  children?: React.ReactNode;
  value?: string;
}

function DetailRowComponent({ label, value, children }: DetailRowProps) {
    return (
      <View style={tw`flex-row items-center gap-5`}>
        <Text style={tw`text-xs text-neutral-600 uppercase font-medium`}>
          {label}
        </Text>
        {value ? (
          <Text style={tw`text-sm text-neutral-900 font-medium`}>{value}</Text>
        ) : (
          children
        )}
      </View>
    );
}

export const DetailRow = React.memo(DetailRowComponent);
