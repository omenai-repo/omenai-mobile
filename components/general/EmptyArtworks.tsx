import { Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import tw from "twrnc";

const EmptyArtworks = ({
  size,
  title,
  description,
  writeUp,
  darkTheme,
  icon,
}: {
  size?: number;
  title?: string;
  description?: string;
  writeUp?: string;
  darkTheme?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) => {
  const displayTitle = title || writeUp || "No Data Found";
  const displayDescription = description || "It Feels a little empty here.";

  return (
    <View style={tw`flex-1 justify-center items-center px-5 gap-5`}>
      <View
        style={tw`w-20 h-20 rounded-full bg-gray-100 justify-center items-center ${
          darkTheme ? "bg-white/10" : ""
        }`}
      >
        <Ionicons
          name={icon || "card"}
          size={size || 46}
          color={darkTheme ? colors.white60 : "#9CA3AF"}
        />
      </View>
      <View style={tw`items-center gap-2`}>
        <Text
          style={tw`text-lg font-semibold text-slate-900 text-center ${
            darkTheme ? "text-white" : ""
          }`}
        >
          {displayTitle}
        </Text>
        <Text
          style={tw`text-sm text-gray-500 text-center ${
            darkTheme ? "text-white/60" : ""
          }`}
        >
          {displayDescription}
        </Text>
      </View>
    </View>
  );
};

export default EmptyArtworks;
