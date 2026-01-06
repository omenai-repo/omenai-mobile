import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import ArtistRegisterationForms from "../../artistRegistrationForm/ArtistRegisterationForms";
import { useLowRiskFeatureFlag } from "#hooks/useFeatureFlag";
import OnboardingBlockerScreen from "#components/blockers/onboarding/OnboardingBlockerScreen";
import ArtistWaitlistForm from "../../artistWaitlistForm/ArtistWaitlistForm";

type ArtistFormProps = Readonly<{
  onInviteValidated?: (validated: boolean) => void;
}>;

const ArtistForm = ({ onInviteValidated }: ArtistFormProps) => {
  const { value: collectorOnboardingEnabled } = useLowRiskFeatureFlag(
    "galleryonboardingenabled"
  );
  const { value: waitlistActivated } =
    useLowRiskFeatureFlag("waitlistActivated");

  if (!collectorOnboardingEnabled) {
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
