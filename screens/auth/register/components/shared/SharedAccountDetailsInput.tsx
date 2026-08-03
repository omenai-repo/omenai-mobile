import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import Input from "#components/inputs/Input";
import PasswordInput from "#components/inputs/PasswordInput";
import NextButton from "#components/buttons/NextButton";
import { useFormValidation } from "#hooks/useFormValidation";
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
  const { formErrors, touched, handleBlur, checkIsDisabled } =
    useFormValidation({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    }, {
      confirmPassword: data.password
    });

  const isButtonDisabled = () => {
    return checkIsDisabled();
  };

  return (
    <View style={tw`gap-10`}>
      <View style={tw`gap-5`}>
        <Input
          label={labels.nameLabel}
          keyboardType="default"
          onInputChange={actions.setName}
          handleBlur={() => handleBlur("name")}
          placeHolder={labels.namePlaceholder}
          value={data.name}
          errorMessage={touched.name ? formErrors.name : ""}
        />
        <Input
          label={labels.emailLabel}
          keyboardType="email-address"
          onInputChange={actions.setEmail}
          handleBlur={() => handleBlur("email")}
          placeHolder={labels.emailPlaceholder}
          value={data.email}
          errorMessage={touched.email ? formErrors.email : ""}
        />
        <PasswordInput
          label="Password"
          onInputChange={actions.setPassword}
          handleBlur={() => handleBlur("password")}
          placeHolder="Enter password"
          value={data.password}
          errorMessage={touched.password ? formErrors.password : ""}
          textContentType="newPassword"
        />
        <PasswordInput
          label="Confirm password"
          onInputChange={actions.setConfirmPassword}
          handleBlur={() => handleBlur("confirmPassword")}
          placeHolder="Enter password again"
          value={data.confirmPassword}
          errorMessage={touched.confirmPassword ? formErrors.confirmPassword : ""}
          textContentType="newPassword"
        />
      </View>
      <View style={tw`flex-row gap-2.5 justify-end`}>
        <NextButton
          isDisabled={isButtonDisabled()}
          handleButtonClick={actions.handleNext}
        />
      </View>
    </View>
  );
}
