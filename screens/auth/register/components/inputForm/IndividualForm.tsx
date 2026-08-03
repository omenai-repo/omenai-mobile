import { View } from "react-native";
import React from "react";
import IndividualRegistrationForm from "#screens/auth/register/components/individualRegistrationForm/IndividualRegistrationForm";
import tw from "twrnc";
import OnboardingBlockerScreen from "#components/blockers/onboarding/OnboardingBlockerScreen";

type IndividualFormProps = Readonly<{
  isEnabled: boolean;
}>;

const IndividualForm = ({ isEnabled }: IndividualFormProps) => {
  return (
    <View style={tw`mt-7`}>
      {isEnabled ? <IndividualRegistrationForm /> : <OnboardingBlockerScreen />}
    </View>
  );
};

export default IndividualForm;
