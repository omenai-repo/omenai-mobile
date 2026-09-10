import { View, Text } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { screenName } from "#constants/screenNames.constants";
import { SvgXml } from "react-native-svg";
import { licenseIcon } from "#utils/assets/SvgImages";
import { colors } from "#config/colors.config";
import tw from "twrnc";

export default function InActiveSubscription() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={tw`flex-1 px-5 justify-center items-center`}>
      <View style={tw`w-full items-center`}>
        <View
          style={tw`w-20 h-20 bg-[${colors.grey50}] rounded-full justify-center items-center mb-6`}
        >
          <SvgXml xml={licenseIcon} width={40} height={40} />
        </View>

        <Text
          style={tw`text-xl font-semibold text-[${colors.black}] mb-3 text-center`}
        >
          No Active Subscription
        </Text>

        <Text
          style={tw`text-sm text-[${colors.inputLabel}] text-center leading-6 mb-8 px-5`}
        >
          Unlock exclusive features and tools to grow your art business. Choose
          a plan that suits your needs.
        </Text>

        <View style={tw`w-full`}>
          <LongBlackButton
            value="View Plans"
            onClick={() =>
              navigation.navigate(screenName.gallery.billing, {
                plan_action: null,
              })
            }
          />
        </View>
      </View>
    </View>
  );
}
