import React, { useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import WaitlistForm from "./WaitlistForm";
import InviteCodeForm from "./InviteCodeForm";
import GalleryRegisterForm from "../galleryRegisterForm/GalleryRegisterForm";

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

  const handleInviteSuccess = (data: ReferrerData) => {
    setReferrerData(data);
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
      <InviteCodeForm
        onSwitchToWaitlist={() => setShowInviteCodeForm(false)}
        onSuccess={handleInviteSuccess}
      />
    );
  }

  // Default: show waitlist form
  return (
    <WaitlistForm onSwitchToInviteCode={() => setShowInviteCodeForm(true)} />
  );
}
