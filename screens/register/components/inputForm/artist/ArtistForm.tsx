import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import ArtistRegisterationForms from "../../artistRegistrationForm/ArtistRegisterationForms";
import { useLowRiskFeatureFlag } from "hooks/useFeatureFlag";
import OnboardingBlockerScreen from "components/blockers/onboarding/OnboardingBlockerScreen";

const ArtistForm = () => {
  const { value: collectorOnboardingEnabled } = useLowRiskFeatureFlag("galleryonboardingenabled");
  return (
    <View style={tw`mt-7`}>
      {collectorOnboardingEnabled ? <ArtistRegisterationForms /> : <OnboardingBlockerScreen />}
    </View>
  );
};

export default ArtistForm;
