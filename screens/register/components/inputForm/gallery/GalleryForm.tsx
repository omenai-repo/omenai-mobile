import tw from "twrnc";
import React from "react";
import { View } from "react-native";
import GalleryRegisterForm from "../../galleryRegisterForm/GalleryRegisterForm";
import { useLowRiskFeatureFlag } from "#hooks/useFeatureFlag";
import OnboardingBlockerScreen from "#components/blockers/onboarding/OnboardingBlockerScreen";
import GalleryWaitlistForm from "../../galleryWaitlistForm/GalleryWaitlistForm";

type GalleryFormProps = Readonly<{
  onInviteValidated?: (validated: boolean) => void;
}>;

export default function GalleryForm({ onInviteValidated }: GalleryFormProps) {
  const { value: isGallery } = useLowRiskFeatureFlag(
    "galleryonboardingenabled"
  );
  const { value: waitlistActivated } =
    useLowRiskFeatureFlag("waitlistActivated");

  if (!isGallery) {
    return <OnboardingBlockerScreen />;
  }

  if (waitlistActivated) {
    return <GalleryWaitlistForm onInviteValidated={onInviteValidated} />;
  }

  return (
    <View style={tw`mt-7`}>
      <GalleryRegisterForm />
    </View>
  );
}
