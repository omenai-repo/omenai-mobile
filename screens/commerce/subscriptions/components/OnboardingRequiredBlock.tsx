import { useNavigation } from "@react-navigation/native";
import PremiumStateCard from "#components/general/PremiumStateCard";
import LongWhiteButton from "#components/buttons/LongWhiteButton";
import React from "react";
import { colors } from "#config/colors.config";
import { screenName } from "#constants/screenNames.constants";

export default function OnboardingRequiredBlock() {
  const navigation = useNavigation<any>();

  function handleCompleteOnboarding() {
    navigation.navigate(screenName.gallery.stripePayouts);
  }

  return (
    <PremiumStateCard
      icon="document-text"
      title="Onboarding Required"
      description="Complete your account setup to access billing and payouts. This is required to manage your subscription."
      onBack={() => navigation.goBack()}
      actionButton={
        <LongWhiteButton
          value="Complete Onboarding"
          onClick={handleCompleteOnboarding}
          outline={false}
          textStyle={{
            color: colors.primary_black,
            fontSize: 14,
            fontWeight: "bold",
          }}
        />
      }
    />
  );
}
