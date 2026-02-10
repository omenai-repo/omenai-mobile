import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import Input from "#components/inputs/Input";
import PasswordInput from "#components/inputs/PasswordInput";
import NextButton from "#components/buttons/NextButton";
import { useFormValidation } from "#hooks/useFormValidation";
import { useKeyboardHeight } from "#hooks/useKeyboardHeight";

export interface AccountDetailsData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AccountDetailsActions {
  setName: (val: string) => void;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
  handleNext: () => void;
}

interface SharedAccountDetailsInputProps {
  data: AccountDetailsData;
  actions: AccountDetailsActions;
  labels: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
  };
  pageIndex: number;
}

export default function SharedAccountDetailsInput({
  data,
  actions,
  labels,
  pageIndex,
}: Readonly<SharedAccountDetailsInputProps>) {
  const { formErrors, handleValidationChecks, checkIsDisabled } =
    useFormValidation({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const keyboardHeight = useKeyboardHeight();

  const isButtonDisabled = () => {
    return checkIsDisabled({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <View style={tw`gap-10`}>
      <View style={tw`gap-5`}>
        <Input
          label={labels.nameLabel}
          keyboardType="default"
          onInputChange={(text) => {
            actions.setName(text);
            handleValidationChecks("name", text);
          }}
          placeHolder={labels.namePlaceholder}
          value={data.name}
          errorMessage={formErrors.name}
        />
        <Input
          label={labels.emailLabel}
          keyboardType="email-address"
          onInputChange={(text) => {
            actions.setEmail(text);
            handleValidationChecks("email", text);
          }}
          placeHolder={labels.emailPlaceholder}
          value={data.email}
          errorMessage={formErrors.email}
        />
        <PasswordInput
          label="Password"
          onInputChange={(text) => {
            actions.setPassword(text);
            handleValidationChecks("password", text);
          }}
          placeHolder="Enter password"
          value={data.password}
          errorMessage={formErrors.password}
          textContentType="newPassword"
        />
        <PasswordInput
          label="Confirm password"
          onInputChange={(text) => {
            actions.setConfirmPassword(text);
            handleValidationChecks("confirmPassword", data.password, text);
          }}
          placeHolder="Enter password again"
          value={data.confirmPassword}
          errorMessage={formErrors.confirmPassword}
          textContentType="newPassword"
        />
      </View>
      <View style={tw`flex-row gap-2.5 justify-end`}>
        <NextButton
          isDisabled={isButtonDisabled()}
          handleButtonClick={actions.handleNext}
        />
      </View>
      <View style={{ height: keyboardHeight }} />
    </View>
  );
}
