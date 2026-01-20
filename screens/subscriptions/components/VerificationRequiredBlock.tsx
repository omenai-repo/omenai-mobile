import React from "react";
import { colors } from "#config/colors.config";
import LongWhiteButton from "#components/buttons/LongWhiteButton";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import PremiumStateCard from "#components/general/PremiumStateCard";

export default function VerificationRequiredBlock({
  onBack,
  disableBack,
}: {
  onBack?: () => void;
  disableBack?: boolean;
}) {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <PremiumStateCard
      icon="shield-checkmark"
      title="Account Verification Required"
      description="Please complete your Stripe onboarding to access subscription features."
      onBack={handleBack}
      disableBack={disableBack}
      actionButton={
        <LongWhiteButton
          value="Complete Setup"
          onClick={() => navigation.navigate(screenName.gallery.stripePayouts)}
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
  );
}
