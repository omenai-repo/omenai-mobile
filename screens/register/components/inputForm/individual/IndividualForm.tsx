import { View } from "react-native";
import React from "react";
import IndividualRegistrationForm from "../../individualRegistrationForm/IndividualRegistrationForm";
import tw from "twrnc";
import { useLowRiskFeatureFlag } from "hooks/useFeatureFlag";
import OnboardingBlockerScreen from "components/blockers/onboarding/OnboardingBlockerScreen";

const IndividualForm = () => {
  const { value: collectorOnboardingEnabled } = useLowRiskFeatureFlag(
    "collectoronboardingenabled",
    false
  );
  return (
    <View style={tw`mt-7`}>
      {collectorOnboardingEnabled ? <IndividualRegistrationForm /> : <OnboardingBlockerScreen />}
    </View>
  );
};

export default IndividualForm;
