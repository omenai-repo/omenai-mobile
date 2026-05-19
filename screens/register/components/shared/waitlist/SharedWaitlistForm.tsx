import { View } from "react-native";
import React, { useState } from "react";
import Input from "#components/inputs/Input";
import LongBlackButton from "#components/buttons/LongBlackButton";
import tw from "twrnc";
import { validateEmail, validateName, UnderlinedLink } from "./waitlistUtils";
import { joinWaitlist } from "#services/waitlist/joinWaitlist";
import { useModalStore } from "#store/modal/modalStore";
type SharedWaitlistFormProps = Readonly<{
  entity: "artist" | "gallery";
  onSwitchToInviteCode: () => void;
}>;

export default function SharedWaitlistForm({
  entity,
  onSwitchToInviteCode,
}: SharedWaitlistFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { updateModal } = useModalStore();

  const isFormValid = !validateName(name, entity) && !validateEmail(email);

  const handleSubmit = async () => {
    const nameError = validateName(name, entity);
    const emailError = validateEmail(email);
    setErrors({ name: nameError, email: emailError });

    if (nameError || emailError) return;

    setIsLoading(true);

    const response = await joinWaitlist({
      name: name.trim(),
      email: email.trim(),
      entity,
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

  const capitalizedEntity = entity.charAt(0).toUpperCase() + entity.slice(1);

  return (
    <View style={tw`mt-7`}>
      <View style={tw`gap-5`}>
        <Input
          label={
            entity === "artist" ? "Your Name" : `${capitalizedEntity} Name`
          }
          keyboardType="default"
          onInputChange={(text) => {
            setName(text);
            setErrors((prev) => ({
              ...prev,
              name: validateName(text, entity),
            }));
          }}
          placeHolder={
            entity === "artist" ? "Enter your name" : `Enter the ${entity} name`
          }
          value={name}
          errorMessage={errors.name}
        />
        <Input
          label={
            entity === "artist"
              ? "Email address"
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
