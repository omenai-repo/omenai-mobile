import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import tw from "twrnc";

type ShowMoreButtonProps = {
  loading: boolean;
  onPress: () => void;
};

export default function ShowMoreButton({
  loading,
  onPress,
}: ShowMoreButtonProps) {
  return (
    <TouchableOpacity
      style={tw`self-center mt-7`}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={loading}
    >
      <View
        style={[
          tw`h-[46px] px-7 rounded-sm justify-center items-center`,
          { backgroundColor: loading ? colors.grey50 : colors.primary_black },
        ]}
      >
        <Text
          style={[
            tw`text-xs font-sans-regular`,
            { color: loading ? colors.inputLabel : colors.white },
          ]}
        >
          {loading ? "Loading…" : "Show more"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
