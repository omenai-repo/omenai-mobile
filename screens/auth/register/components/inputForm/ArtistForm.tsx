import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import ArtistRegisterationForms from "#screens/auth/register/components/artistRegistrationForm/ArtistRegisterationForms";
import OnboardingBlockerScreen from "#components/blockers/onboarding/OnboardingBlockerScreen";
import ArtistWaitlistForm from "#screens/auth/register/components/artistWaitlistForm/ArtistWaitlistForm";

type ArtistFormProps = Readonly<{
  onInviteValidated?: (validated: boolean) => void;
  isEnabled: boolean;
  waitlistActivated: boolean;
}>;

const ArtistForm = ({
  onInviteValidated,
  isEnabled,
  waitlistActivated,
}: ArtistFormProps) => {
  if (!isEnabled) {
    return <OnboardingBlockerScreen />;
  }

  if (waitlistActivated) {
    return <ArtistWaitlistForm onInviteValidated={onInviteValidated} />;
  }

  return (
    <View style={tw`mt-7`}>
      <ArtistRegisterationForms />
    </View>
  );
};

export default ArtistForm;
