import { View } from "react-native";
import React, { useState } from "react";
import Input from "#components/inputs/Input";
import LongBlackButton from "#components/buttons/LongBlackButton";
import tw from "twrnc";
import {
  validateEmail,
  validateGalleryName,
  UnderlinedLink,
} from "./waitlistUtils";
import { joinWaitlist } from "#services/waitlist/joinWaitlist";
import { useModalStore } from "#store/modal/modalStore";

type WaitlistFormProps = Readonly<{
  onSwitchToInviteCode: () => void;
}>;

export default function WaitlistForm({
  onSwitchToInviteCode,
}: WaitlistFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { updateModal } = useModalStore();

  const isFormValid = !validateGalleryName(name) && !validateEmail(email);

  const handleSubmit = async () => {
    const nameError = validateGalleryName(name);
    const emailError = validateEmail(email);
    setErrors({ name: nameError, email: emailError });

    if (nameError || emailError) return;

    setIsLoading(true);

    const response = await joinWaitlist({
      name: name.trim(),
      email: email.trim(),
      entity: "gallery",
    });

    setIsLoading(false);

    if (response.isOk) {
      updateModal({
        message: response.message || "You've been added to the waitlist!",
        modalType: "success",
        showModal: true,
      });
      setName("");
      setEmail("");
    } else {
      updateModal({
        message: response.message || "Something went wrong. Please try again.",
        modalType: "error",
        showModal: true,
      });
    }
  };

  return (
    <View style={tw`mt-7`}>
      <View style={tw`gap-5`}>
        <Input
          label="Gallery Name"
          keyboardType="default"
          onInputChange={(text) => {
            setName(text);
            setErrors((prev) => ({ ...prev, name: validateGalleryName(text) }));
          }}
          placeHolder="Enter the gallery name"
          value={name}
          errorMessage={errors.name}
        />
        <Input
          label="Gallery's email address"
          keyboardType="email-address"
          onInputChange={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
          }}
          placeHolder="Enter the gallery email address"
          value={email}
          errorMessage={errors.email}
        />
      </View>

      <UnderlinedLink
        text="I have an invite code"
        onPress={onSwitchToInviteCode}
      />

      <View style={tw`mt-6`}>
        <LongBlackButton
          value="Join the waitlist"
          onClick={handleSubmit}
          isDisabled={!isFormValid}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}
