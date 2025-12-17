import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BackScreenButton from "#components/buttons/BackScreenButton";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import tw from "twrnc";

import { screenName } from "#constants/screenNames.constants";
import { colors } from "#config/colors.config";

export default function NoSubscriptionBlock() {
  const { height } = useWindowDimensions();
  const navigation = useNavigation<any>();

  return (
    <View style={tw`flex-1 bg-[#fff] pt-[60px] android:pt-[80px] px-[25px]`}>
      <BackScreenButton handleClick={() => navigation.goBack()} />
      <View
        style={[
          tw`items-center justify-center mt-10 rounded-2xl px-4 py-[40px]`,
          {
            marginTop: height / 5,
            backgroundColor: colors.black,
          },
        ]}
      >
        <View style={tw`flex items-center gap-4`}>
          <Ionicons name="shield" size={35} color="white" />
          <View style={tw`mb-3`}>
            <Text style={tw`text-white text-center`}>
              You need to have an active subscription to use this feature.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(screenName.gallery.billing, {
                plan_action: null,
              })
            }
            style={tw`bg-white rounded-md h-10 px-6 w-full items-center justify-center`}
          >
            <Text style={[tw`text-sm font-medium`, { color: colors.black }]}>
              Activate Subscription
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
