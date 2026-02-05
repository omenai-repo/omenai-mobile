import { View } from "react-native";
import React from "react";
import PasswordInput from "../../../../components/inputs/PasswordInput";
import Input from "../../../../components/inputs/Input";
import NextButton from "../../../../components/buttons/NextButton";
import { useIndividualAuthRegisterStore } from "../../../../store/auth/register/IndividualAuthRegisterStore";
import tw from "twrnc";
import { useFormValidation } from "#hooks/useFormValidation";

export default function AccountDetailsInput() {
  const {
    individualRegisterData,
    setEmail,
    setName,
    setPassword,
    setConfirmPassword,
    pageIndex,
    setPageIndex,
  } = useIndividualAuthRegisterStore();

  const { formErrors, handleValidationChecks, checkIsDisabled } =
    useFormValidation({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const isButtonDisabled = () => {
    return checkIsDisabled({
      name: individualRegisterData.name,
      email: individualRegisterData.email,
      password: individualRegisterData.password,
      confirmPassword: individualRegisterData.confirmPassword,
    });
  };

  return (
    <View style={tw`gap-10`}>
      <View style={tw`gap-5`}>
        <Input
          label="Full name"
          keyboardType="default"
          onInputChange={(text) => {
            setName(text);
            handleValidationChecks("name", text);
          }}
          placeHolder="Enter your full name"
          value={individualRegisterData.name}
          errorMessage={formErrors.name}
        />
        <Input
          label="Email address"
          keyboardType="email-address"
          onInputChange={(text) => {
            setEmail(text);
            handleValidationChecks("email", text);
          }}
          placeHolder="Enter your email address"
          value={individualRegisterData.email}
          errorMessage={formErrors.email}
        />
        <PasswordInput
          label="Password"
          onInputChange={(text) => {
            setPassword(text);
            handleValidationChecks("password", text); // ✅ Debounced validation
          }}
          placeHolder="Enter password"
          value={individualRegisterData.password}
          errorMessage={formErrors.password}
          textContentType="newPassword"
        />
        <PasswordInput
          label="Confirm password"
          onInputChange={(text) => {
            setConfirmPassword(text);
            handleValidationChecks(
              "confirmPassword",
              individualRegisterData.password,
              text,
            );
          }}
          placeHolder="Enter password again"
          value={individualRegisterData.confirmPassword}
          errorMessage={formErrors.confirmPassword}
          textContentType="newPassword"
        />
      </View>
      <View style={tw`flex-row gap-2.5 justify-end`}>
        <NextButton
          isDisabled={isButtonDisabled()}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
}
