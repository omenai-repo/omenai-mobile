import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../../config/colors.config";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import { useDevice } from "#hooks/useDevice";

type AuthHeaderProps = {
  readonly title: string;
  readonly subTitle: string;
  readonly handleBackClick: () => void;
};

export default function AuthHeader({
  title,
  subTitle,
  handleBackClick,
}: AuthHeaderProps) {
  const { isTablet } = useDevice();

  return (
    <SafeAreaView
      style={[
        {
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          backgroundColor: colors.black,
        },
      ]}
    >
      <View
        style={[
          tw`pt-2.5`,
          {
            paddingHorizontal: isTablet ? 40 : 20,
            paddingBottom: isTablet ? 30 : 20,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            tw`h-10 w-10 rounded-full items-center justify-center`,
            { backgroundColor: colors.black_light },
          ]}
          onPress={handleBackClick}
        >
          <AntDesign name="arrow-left" color={colors.white} size={20} />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-white font-sans-regular mt-5`,
            isTablet ? tw`text-[28px]` : tw`text-lg`,
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            tw`text-[#FFFFFFB2] font-sans-regular mt-2.5`,
            isTablet ? tw`text-[18px]` : tw`text-sm`,
          ]}
        >
          {subTitle}
        </Text>
      </View>
    </SafeAreaView>
  );
}
