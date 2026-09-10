import { View } from "react-native";
import React from "react";
import PasswordInput from "#components/inputs/PasswordInput";
import Input from "#components/inputs/Input";
import NextButton from "#components/buttons/NextButton";
import { useIndividualAuthRegisterStore } from "#store/auth/register/IndividualAuthRegisterStore";
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

  const { formErrors, touched, handleBlur, checkIsDisabled } =
    useFormValidation(
      {
        name: individualRegisterData.name,
        email: individualRegisterData.email,
        password: individualRegisterData.password,
        confirmPassword: individualRegisterData.confirmPassword,
      },
      {
        confirmPassword: individualRegisterData.password,
      },
    );

  return (
    <View style={tw`gap-10`}>
      <View style={tw`gap-5`}>
        <Input
          label="Full name"
          keyboardType="default"
          onInputChange={setName}
          handleBlur={() => handleBlur("name")}
          placeHolder="Enter your full name"
          value={individualRegisterData.name}
          errorMessage={touched.name ? formErrors.name : ""}
        />
        <Input
          label="Email address"
          keyboardType="email-address"
          onInputChange={setEmail}
          handleBlur={() => handleBlur("email")}
          placeHolder="Enter your email address"
          value={individualRegisterData.email}
          errorMessage={touched.email ? formErrors.email : ""}
        />
        <PasswordInput
          label="Password"
          onInputChange={setPassword}
          handleBlur={() => handleBlur("password")}
          placeHolder="Enter password"
          value={individualRegisterData.password}
          errorMessage={touched.password ? formErrors.password : ""}
          textContentType="newPassword"
        />
        <PasswordInput
          label="Confirm password"
          onInputChange={setConfirmPassword}
          handleBlur={() => handleBlur("confirmPassword")}
          placeHolder="Enter password again"
          value={individualRegisterData.confirmPassword}
          errorMessage={
            touched.confirmPassword ? formErrors.confirmPassword : ""
          }
          textContentType="newPassword"
        />
      </View>
      <View style={tw`flex-row gap-2.5 justify-end`}>
        <NextButton
          isDisabled={checkIsDisabled()}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
}
