import React, { useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import SharedWaitlistForm from "../shared/waitlist/SharedWaitlistForm";
import SharedInviteCodeForm from "../shared/waitlist/SharedInviteCodeForm";
import ArtistRegisterationForms from "../artistRegistrationForm/ArtistRegisterationForms";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";

type ReferrerData = {
  referrerKey: string;
  email: string;
  inviteCode: string;
};

type ArtistWaitlistFormProps = Readonly<{
  onInviteValidated?: (validated: boolean) => void;
}>;

export default function ArtistWaitlistForm({
  onInviteValidated,
}: ArtistWaitlistFormProps) {
  const [showInviteCodeForm, setShowInviteCodeForm] = useState(false);
  const [inviteValidated, setInviteValidated] = useState(false);
  const [referrerData, setReferrerData] = useState<ReferrerData | null>(null);
  const { setEmail, setReferrerKey, setInviteCode } =
    useArtistAuthRegisterStore();

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
        <ArtistRegisterationForms />
      </View>
    );
  }

  // Show invite code form
  if (showInviteCodeForm) {
    return (
      <SharedInviteCodeForm
        entity="artist"
        onSwitchToWaitlist={() => setShowInviteCodeForm(false)}
        onSuccess={handleInviteSuccess}
      />
    );
  }

  // Default: show waitlist form
  return (
    <SharedWaitlistForm
      entity="artist"
      onSwitchToInviteCode={() => setShowInviteCodeForm(true)}
    />
  );
}
