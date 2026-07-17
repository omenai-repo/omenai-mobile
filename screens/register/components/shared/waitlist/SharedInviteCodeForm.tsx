import { View } from "react-native";
import React, { useState } from "react";
import Input from "#components/inputs/Input";
import LongBlackButton from "#components/buttons/LongBlackButton";
import tw from "twrnc";
import {
  validateEmail,
  validateInviteCode,
  UnderlinedLink,
} from "./waitlistUtils";
import { createInviteToken } from "#services/waitlist/createInviteToken";
import { useModalStore } from "#store/modal/modalStore";
type SharedInviteCodeFormProps = Readonly<{
  entity: "artist" | "gallery";
  onSwitchToWaitlist: () => void;
  onSuccess: (data: {
    referrerKey: string;
    email: string;
    inviteCode: string;
  }) => void;
}>;

export default function SharedInviteCodeForm({
  entity,
  onSwitchToWaitlist,
  onSuccess,
}: SharedInviteCodeFormProps) {
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [errors, setErrors] = useState<{ email?: string; inviteCode?: string }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);

  const { updateModal } = useModalStore();

  const isFormValid = !validateEmail(email) && !validateInviteCode(inviteCode);

  const handleSubmit = async () => {
    const emailError = validateEmail(email);
    const inviteCodeError = validateInviteCode(inviteCode);
    setErrors({ email: emailError, inviteCode: inviteCodeError });

    if (emailError || inviteCodeError) return;

    setIsLoading(true);
    try {
      const response = await createInviteToken({
        email: email.trim(),
        inviteCode: inviteCode.trim(),
        entity,
      });

      if (response.isOk && response.referrerKey) {
        updateModal({
          message: response.message || "Invite code validated!",
          modalType: "success",
          showModal: true,
        });
        onSuccess({
          referrerKey: response.referrerKey,
          email: email.trim(),
          inviteCode: inviteCode.trim(),
        });
      } else {
        updateModal({
          message:
            response.message || "Invalid invite code. Please try again.",
          modalType: "error",
          showModal: true,
        });
      }
    } catch {
      updateModal({
        message:
          "Unable to verify your invite right now. Check your connection and try again.",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const capitalizedEntity = entity.charAt(0).toUpperCase() + entity.slice(1);

  return (
    <View style={tw`mt-7`}>
      <View style={tw`gap-5`}>
        <Input
          label={
            entity === "artist"
              ? "Your email address"
              : `${capitalizedEntity}'s email address`
          }
          keyboardType="email-address"
          onInputChange={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
          }}
          placeHolder={
            entity === "artist"
              ? "Enter your email address"
              : `Enter the ${entity} email address`
          }
          value={email}
          errorMessage={errors.email}
        />
        <Input
          label="Invite Code"
          keyboardType="default"
          onInputChange={(text) => {
            setInviteCode(text);
            setErrors((prev) => ({
              ...prev,
              inviteCode: validateInviteCode(text),
            }));
          }}
          placeHolder="Enter your invite code"
          value={inviteCode}
          errorMessage={errors.inviteCode}
        />
      </View>

      <UnderlinedLink
        text="I don't have an invite code"
        onPress={onSwitchToWaitlist}
      />

      <View style={tw`mt-6`}>
        <LongBlackButton
          value="Continue"
          onClick={handleSubmit}
          isDisabled={!isFormValid}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}
