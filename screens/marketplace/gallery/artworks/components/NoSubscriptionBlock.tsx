import { useNavigation } from "@react-navigation/native";
import BackScreenButton from "#components/buttons/BackScreenButton";
import LongWhiteButton from "#components/buttons/LongWhiteButton";
import React from "react";
import { View } from "react-native";
import tw from "twrnc";
import { screenName } from "#constants/screenNames.constants";
import { colors } from "#config/colors.config";
import PremiumStateCard from "#components/general/PremiumStateCard";

export default function NoSubscriptionBlock() {
  const navigation = useNavigation<any>();

  return (
    <View style={tw`flex-1 bg-white relative`}>
      <View style={tw`absolute top-[60px] left-[25px] z-50`}>
        <BackScreenButton handleClick={() => navigation.goBack()} />
      </View>
      <PremiumStateCard
        icon="shield-checkmark"
        title="Subscription Required"
        description="You need an active subscription to access premium features. Upgrade now to unlock your full potential."
        disableBack={true}
        actionButton={
          <LongWhiteButton
            value="Activate Subscription"
            onClick={() =>
              navigation.navigate(screenName.gallery.billing, {
                plan_action: null,
              })
            }
            outline={false}
            style={{
              height: 48,
              backgroundColor: colors.white,
            }}
            textStyle={{
              color: colors.primary_black,
              fontSize: 14,
              fontWeight: "bold",
            }}
          />
        }
      />
    </View>
  );
}
