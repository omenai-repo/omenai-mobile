import tw from "twrnc";
import React from "react";
import { View } from "react-native";
import GalleryRegisterForm from "#screens/auth/register/components/galleryRegisterForm/GalleryRegisterForm";
import OnboardingBlockerScreen from "#components/blockers/onboarding/OnboardingBlockerScreen";
import GalleryWaitlistForm from "#screens/auth/register/components/galleryWaitlistForm/GalleryWaitlistForm";

type GalleryFormProps = Readonly<{
  onInviteValidated?: (validated: boolean) => void;
  isEnabled: boolean;
  waitlistActivated: boolean;
}>;

export default function GalleryForm({
  onInviteValidated,
  isEnabled,
  waitlistActivated,
}: GalleryFormProps) {
  if (!isEnabled) {
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
