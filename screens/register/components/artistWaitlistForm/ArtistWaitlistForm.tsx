import React, { useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import SharedWaitlistForm from "../shared/waitlist/SharedWaitlistForm";
import SharedInviteCodeForm from "../shared/waitlist/SharedInviteCodeForm";
import ArtistRegisterationForms from "../artistRegistrationForm/ArtistRegisterationForms";

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

  const handleInviteSuccess = (data: ReferrerData) => {
    setReferrerData(data);
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
