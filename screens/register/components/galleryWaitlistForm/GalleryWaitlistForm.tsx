import React, { useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import SharedWaitlistForm from "../shared/waitlist/SharedWaitlistForm";
import SharedInviteCodeForm from "../shared/waitlist/SharedInviteCodeForm";
import GalleryRegisterForm from "../galleryRegisterForm/GalleryRegisterForm";
import { useGalleryAuthRegisterStore } from "#store/auth/register/GalleryAuthRegisterStore";

type ReferrerData = {
  referrerKey: string;
  email: string;
  inviteCode: string;
};

type GalleryWaitlistFormProps = Readonly<{
  onInviteValidated?: (validated: boolean) => void;
}>;

export default function GalleryWaitlistForm({
  onInviteValidated,
}: GalleryWaitlistFormProps) {
  const [showInviteCodeForm, setShowInviteCodeForm] = useState(false);
  const [inviteValidated, setInviteValidated] = useState(false);
  const [referrerData, setReferrerData] = useState<ReferrerData | null>(null);
  const { setEmail, setReferrerKey, setInviteCode } =
    useGalleryAuthRegisterStore();

  const handleInviteSuccess = (data: ReferrerData) => {
    setReferrerData(data);
    setEmail(data.email);
    setReferrerKey(data.referrerKey);
    setInviteCode(data.inviteCode);
    setInviteValidated(true);
    onInviteValidated?.(true);
  };

  // If invite code validated, show the registration form
  if (inviteValidated && referrerData) {
    return (
      <View style={tw`mt-7`}>
        <GalleryRegisterForm />
      </View>
    );
  }

  // Show invite code form
  if (showInviteCodeForm) {
    return (
      <SharedInviteCodeForm
        entity="gallery"
        onSwitchToWaitlist={() => setShowInviteCodeForm(false)}
        onSuccess={handleInviteSuccess}
      />
    );
  }

  // Default: show waitlist form
  return (
    <SharedWaitlistForm
      entity="gallery"
      onSwitchToInviteCode={() => setShowInviteCodeForm(true)}
    />
  );
}
