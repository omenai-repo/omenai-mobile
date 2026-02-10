import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { colors } from "#config/colors.config";
import { Feather } from "@expo/vector-icons";
import { screenName } from "#constants/screenNames.constants";
import { artworkListingType } from "#types/types";
import tw from "twrnc";

type ViewAllCategoriesButtonProps = {
  label: string;
  darkMode?: boolean;
  listingType: artworkListingType;
};

export default function ViewAllCategoriesButton({
  label,
  darkMode,
  listingType,
}: Readonly<ViewAllCategoriesButtonProps>) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(screenName.artworksMedium, { catalog: listingType })
      }
    >
      <View
        style={tw.style(
          "rounded-[20px] border border-black px-5 py-2.5 mt-[120px] mx-[30px] flex-row items-center gap-2.5",
          darkMode && "border-white",
        )}
      >
        <Text style={tw.style("text-sm", darkMode && "text-white")}>
          {label}
        </Text>
        <Feather
          name="arrow-right"
          size={18}
          color={darkMode ? colors.white : colors.black}
        />
      </View>
    </TouchableOpacity>
  );
}
