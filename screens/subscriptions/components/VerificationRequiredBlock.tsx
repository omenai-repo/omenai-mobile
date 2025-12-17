import { View, Text } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";

export default function VerificationRequiredBlock() {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <View
        style={{
          backgroundColor: colors.black,
          padding: 20,
          borderRadius: 10,
          alignItems: "center",
          gap: 15,
        }}
      >
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: "600" }}>
          Account Verification Required
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: colors.white,
          }}
        >
          Please complete your Stripe onboarding to access subscription
          features.
        </Text>
        <View style={{ width: "100%" }}>
          <LongBlackButton
            style={{ backgroundColor: colors.white }}
            textStyle={{ color: colors.black }}
            value="Complete Setup"
            onClick={() =>
              navigation.navigate(screenName.gallery.stripePayouts)
            }
          />
        </View>
      </View>
    </View>
  );
}
